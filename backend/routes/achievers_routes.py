"""
Bharathi Thervukalam - Achievers & Success Stories API Routes
Handles hall of fame selections, ranks, and student testimonials.
"""

from flask import Blueprint, request, jsonify
from database import query_all, query_one, execute_write

achievers_bp = Blueprint("achievers", __name__)

@achievers_bp.route("/achivers_all.php", methods=["GET"])
@achievers_bp.route("/api/achievers", methods=["GET"])
def get_all_achievers():
    """Retrieve all selected officer alumni."""
    achievers = query_all("SELECT * FROM achievers ORDER BY year DESC, id DESC")
    return jsonify(achievers)

@achievers_bp.route("/achivers_save.php", methods=["POST"])
@achievers_bp.route("/api/achievers", methods=["POST"])
def save_achiever():
    data = request.form.to_dict() if request.form else (request.get_json(silent=True) or {})
    name = data.get("name", "").strip()
    posting = data.get("posting", "").strip()
    exam = data.get("exam", "TNPSC").strip()

    if not name or not posting:
        return jsonify({"status": "error", "message": "Candidate name and posting designation are required"}), 400

    res = execute_write(
        """INSERT INTO achievers (name, posting, exam, category, year, department, hometown, rank_text, story, advice)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
        (
            name,
            posting,
            exam,
            data.get("category", "group4"),
            data.get("year", "2024"),
            data.get("department", "State Administration"),
            data.get("hometown", "Tamil Nadu"),
            data.get("rank", "State Rank"),
            data.get("story", "Prepared diligently with Bharathi Academy test series."),
            data.get("advice", "Consistency in revision and weekend test writing is key.")
        )
    )
    return jsonify({
        "status": "success",
        "message": "Achiever recorded successfully",
        "achiever_id": res.get("last_id")
    }), 201

@achievers_bp.route("/achivers_update.php", methods=["POST", "PUT"])
@achievers_bp.route("/api/achievers/<int:ach_id>", methods=["PUT"])
def update_achiever(ach_id=None):
    if ach_id is None:
        ach_id = request.args.get("id")

    data = request.form.to_dict() if request.form else (request.get_json(silent=True) or {})
    execute_write(
        """UPDATE achievers SET 
            name = COALESCE(%s, name),
            posting = COALESCE(%s, posting),
            exam = COALESCE(%s, exam),
            department = COALESCE(%s, department),
            rank_text = COALESCE(%s, rank_text),
            story = COALESCE(%s, story)
        WHERE id = %s""",
        (
            data.get("name"),
            data.get("posting"),
            data.get("exam"),
            data.get("department"),
            data.get("rank"),
            data.get("story"),
            ach_id
        )
    )
    return jsonify({"status": "success", "message": "Achiever record updated successfully"})

@achievers_bp.route("/achivers_delete.php", methods=["DELETE", "POST"])
@achievers_bp.route("/api/achievers/<int:ach_id>", methods=["DELETE"])
def delete_achiever(ach_id=None):
    if ach_id is None:
        ach_id = request.args.get("id")

    execute_write("DELETE FROM achievers WHERE id = %s", (ach_id,))
    return jsonify({"status": "success", "message": "Achiever record removed successfully"})
