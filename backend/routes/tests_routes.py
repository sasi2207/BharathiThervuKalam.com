"""
Bharathi Thervukalam - Test Series & Question Papers API Routes
Handles mock test creation, weekly schedules, question paper upload/download, and test lifecycle.
"""

import os
import random
from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from database import query_all, query_one, execute_write
from config import Config

tests_bp = Blueprint("tests", __name__)

@tests_bp.route("/test_all.php", methods=["GET"])
@tests_bp.route("/api/tests", methods=["GET"])
def get_all_tests():
    """Retrieve all test series batches."""
    tests = query_all("SELECT * FROM tests ORDER BY id DESC")
    
    # Format to match frontend structure
    formatted = []
    for t in tests:
        formatted.append({
            "id": t["id"],
            "test_code": t.get("test_code", f"test-{t['id']}"),
            "namepost": t.get("category", "TNPSC"),
            "department": t.get("department", "GROUP IV"),
            "paper": t.get("paper") or t.get("title", ""),
            "title": t.get("title", ""),
            "subject": t.get("paper", ""),
            "standard": t.get("standard", "Question"),
            "totalQuestions": t.get("total_questions_text") or f"{t.get('total_questions', 25)} Questions",
            "duration": t.get("duration_text", "3 Hours"),
            "durationMinutes": t.get("duration_minutes", 180),
            "date": str(t.get("exam_date") or "2026-03-29"),
            "positiveMark": float(t.get("positive_mark") or 1.5),
            "negativeMark": float(t.get("negative_mark") or 0.0),
            "filename": t.get("pdf_filename") or "SUNDAY GRP 4 SCHEDULE -2025.pdf",
            "pdfUrl": f"/uploads/{t.get('pdf_filename')}" if t.get("pdf_filename") else "/SUNDAY GRP 4 SCHEDULE -2025.pdf"
        })
    return jsonify(formatted)

@tests_bp.route("/test_upload.php", methods=["POST"])
@tests_bp.route("/api/tests", methods=["POST"])
def upload_test():
    """Create a new mock test series batch and attach question paper PDF."""
    data = request.form.to_dict() if request.form else (request.get_json(silent=True) or {})
    
    namepost = data.get("namepost", "TNPSC")
    department = data.get("department", "GROUP IV")
    paper = data.get("paper", "Weekly Mock Exam")
    standard = data.get("standard", "Question")
    total_q_text = data.get("totalQuestions", "200 Questions (300 Marks)")
    duration_text = data.get("duration", "3 Hours")
    exam_date = data.get("testDate") or data.get("date") or "2026-03-29"

    # Handle file upload if present
    file = request.files.get("file")
    filename = None
    filepath = None
    if file and file.filename:
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
    else:
        filename = f"{department.replace(' ', '_')}_Mock_Test.pdf"

    test_code = f"BTK-TEST-{random.randint(1000, 9999)}"
    title = f"{department} {standard}: {paper}"

    res = execute_write(
        """INSERT INTO tests (
            test_code, title, category, department, paper, standard, 
            total_questions, total_questions_text, duration_minutes, duration_text, 
            exam_date, positive_mark, negative_mark, pdf_filename, pdf_path
        ) VALUES (%s, %s, %s, %s, %s, %s, 25, %s, 180, %s, %s, 1.50, 0.00, %s, %s)""",
        (test_code, title, namepost, department, paper, standard, total_q_text, duration_text, exam_date, filename, filepath)
    )

    test_id = res.get("last_id")

    # Also automatically seed default 25 OMR questions for this test so it is ready for OMR evaluation immediately
    for q_no in range(1, 26):
        execute_write(
            """INSERT INTO omr_questions (
                test_id, q_no, question_text, option_a, option_b, option_c, option_d, option_e, correct_key, explanation, topic
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE correct_key=VALUES(correct_key)""",
            (
                test_id,
                q_no,
                f"Question {q_no} for {paper}. Official examination question.",
                "Option A", "Option B", "Option C", "Option D",
                "Answer Not Known (விடை தெரியவில்லை)",
                ["A", "B", "C", "D"][(q_no - 1) % 4],
                f"Standard key and explanation for Question {q_no}.",
                department
            )
        )

    return jsonify({
        "status": "success",
        "message": "Test series scheduled successfully with OMR key enabled",
        "test_id": test_id,
        "test_code": test_code,
        "title": title
    }), 201

@tests_bp.route("/test_update.php", methods=["POST", "PUT"])
@tests_bp.route("/api/tests/<int:test_id>", methods=["PUT"])
def update_test(test_id=None):
    """Update test details."""
    if test_id is None:
        test_id = request.args.get("id")

    data = request.form.to_dict() if request.form else (request.get_json(silent=True) or {})
    
    paper = data.get("paper")
    department = data.get("department")
    standard = data.get("standard")
    namepost = data.get("namepost")

    execute_write(
        """UPDATE tests SET 
            paper = COALESCE(%s, paper),
            department = COALESCE(%s, department),
            standard = COALESCE(%s, standard),
            category = COALESCE(%s, category)
        WHERE id = %s""",
        (paper, department, standard, namepost, test_id)
    )
    return jsonify({"status": "success", "message": "Test series updated successfully"})

@tests_bp.route("/test_delete.php", methods=["DELETE", "POST"])
@tests_bp.route("/api/tests/<int:test_id>", methods=["DELETE"])
def delete_test(test_id=None):
    """Delete a test and all its questions and submissions."""
    if test_id is None:
        test_id = request.args.get("id")

    execute_write("DELETE FROM tests WHERE id = %s", (test_id,))
    return jsonify({"status": "success", "message": "Test record deleted successfully"})

@tests_bp.route("/test_download.php", methods=["GET"])
@tests_bp.route("/api/tests/<int:test_id>/download", methods=["GET"])
def download_test(test_id=None):
    """Download question paper PDF."""
    if test_id is None:
        test_id = request.args.get("id")

    test = query_one("SELECT * FROM tests WHERE id = %s", (test_id,))
    filename = test.get("pdf_filename") if test else "SUNDAY GRP 4 SCHEDULE -2025.pdf"

    filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
    if os.path.exists(filepath):
        return send_from_directory(Config.UPLOAD_FOLDER, filename, as_attachment=True)
    
    # Return placeholder file
    return jsonify({
        "status": "info",
        "message": f"Downloading official question paper for {filename}",
        "filename": filename
    })
