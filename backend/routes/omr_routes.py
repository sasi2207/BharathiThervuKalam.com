"""
Bharathi Thervukalam - OMR Master Answer Keys & Automated Evaluation Engine API Routes
Handles MySQL storage of master answer keys, candidate OMR submissions, automated grading, 
and performance analytics.
"""

import math
import random
import time
from flask import Blueprint, request, jsonify
from database import query_all, query_one, execute_write

omr_bp = Blueprint("omr", __name__)

# =============================================================================
# 1. OMR MASTER ANSWER KEYS MANAGEMENT
# =============================================================================

@omr_bp.route("/api/omr/tests", methods=["GET"])
@omr_bp.route("/omr_tests.php", methods=["GET"])
def get_omr_tests():
    """Retrieve all tests with their questions and master answer keys."""
    tests = query_all("SELECT * FROM tests ORDER BY id ASC")
    result = []
    for t in tests:
        questions = query_all(
            "SELECT * FROM omr_questions WHERE test_id = %s ORDER BY q_no ASC",
            (t["id"],)
        )
        q_list = []
        for q in questions:
            q_list.append({
                "qNo": q["q_no"],
                "question": q["question_text"],
                "options": {
                    "A": q["option_a"],
                    "B": q["option_b"],
                    "C": q["option_c"],
                    "D": q["option_d"],
                    "E": q.get("option_e", "Answer Not Known")
                },
                "correctKey": q["correct_key"],
                "explanation": q.get("explanation", ""),
                "topic": q.get("topic", "General Studies")
            })

        result.append({
            "id": t["id"],
            "test_code": t.get("test_code", f"test-{t['id']}"),
            "title": t["title"],
            "category": t["category"],
            "department": t["department"],
            "totalQuestions": len(q_list) or t.get("total_questions", 25),
            "positiveMark": float(t.get("positive_mark") or 1.5),
            "negativeMark": float(t.get("negative_mark") or 0.0),
            "durationMinutes": t.get("duration_minutes", 180),
            "questions": q_list
        })
    return jsonify(result)

@omr_bp.route("/api/omr/master-keys", methods=["GET"])
@omr_bp.route("/omr_master_keys.php", methods=["GET"])
def get_master_keys():
    """Retrieve master answer keys for a given test_id."""
    test_id = request.args.get("test_id")
    if not test_id:
        return jsonify({"status": "error", "message": "test_id parameter required"}), 400

    questions = query_all(
        "SELECT q_no, correct_key, explanation, topic FROM omr_questions WHERE test_id = %s ORDER BY q_no ASC",
        (test_id,)
    )
    keys_map = {q["q_no"]: q["correct_key"] for q in questions}
    return jsonify({
        "status": "success",
        "test_id": test_id,
        "total_questions": len(questions),
        "keys": keys_map,
        "details": questions
    })

@omr_bp.route("/api/omr/master-keys", methods=["POST"])
@omr_bp.route("/omr_master_save.php", methods=["POST"])
def save_master_keys():
    """Save or update master answer keys in MySQL database."""
    data = request.get_json(silent=True) or request.form.to_dict()
    test_id = data.get("test_id")
    keys_map = data.get("keys", {}) # e.g. {"1": "A", "2": "C"}
    explanations = data.get("explanations", {})

    if not test_id:
        return jsonify({"status": "error", "message": "test_id is required"}), 400

    # Ensure test exists
    test = query_one("SELECT id FROM tests WHERE id = %s", (test_id,))
    if not test:
        # Create test if missing
        res = execute_write(
            "INSERT INTO tests (test_code, title, category, department) VALUES (%s, %s, 'TNPSC', 'Group IV')",
            (f"TEST-{test_id}", f"Mock Test {test_id}")
        )
        test_id = res.get("last_id")

    # Update or insert question keys
    updated_count = 0
    for q_no_str, correct_key in keys_map.items():
        q_no = int(q_no_str)
        expl = explanations.get(str(q_no), f"Verified solution for Question {q_no}.")

        existing_q = query_one("SELECT id FROM omr_questions WHERE test_id = %s AND q_no = %s", (test_id, q_no))
        if existing_q:
            execute_write(
                "UPDATE omr_questions SET correct_key = %s, explanation = %s WHERE id = %s",
                (correct_key, expl, existing_q["id"])
            )
        else:
            execute_write(
                """INSERT INTO omr_questions (test_id, q_no, question_text, option_a, option_b, option_c, option_d, correct_key, explanation)
                   VALUES (%s, %s, %s, 'Option A', 'Option B', 'Option C', 'Option D', %s, %s)""",
                (test_id, q_no, f"Question {q_no}", correct_key, expl)
            )
        updated_count += 1

    return jsonify({
        "status": "success",
        "message": f"Successfully synced {updated_count} master answer keys to MySQL",
        "test_id": test_id
    })

# =============================================================================
# 2. STUDENT OMR SUBMISSION & AUTOMATED VALIDATION ENGINE
# =============================================================================

@omr_bp.route("/api/omr/submit", methods=["POST"])
@omr_bp.route("/omr_submit.php", methods=["POST"])
def submit_and_validate_omr():
    """
    Core automated evaluation engine:
    1. Reads candidate's filled answers
    2. Compares with official master answer key from MySQL
    3. Computes marks, accuracy, percentage, cutoff zone, and simulated rank
    4. Persists submission in MySQL database
    5. Returns instant verified scorecard & breakdown
    """
    data = request.get_json(silent=True) or request.form.to_dict()
    test_id = data.get("testId") or data.get("test_id")
    student_roll = data.get("rollNo") or data.get("student_roll_no", "BTK2026-0428")
    student_name = data.get("studentName") or data.get("student_name", "S. Kabilan")
    booklet_series = data.get("bookletSeries", "A")
    candidate_answers = data.get("candidateAnswers", {}) # e.g. {"1": "C", "2": "B"}
    time_spent = int(data.get("timeSpentSeconds", 3600))

    if not test_id:
        # Fallback to first test in DB
        first_test = query_one("SELECT id FROM tests LIMIT 1")
        test_id = first_test["id"] if first_test else 1

    # Fetch test details
    test = query_one("SELECT * FROM tests WHERE id = %s", (test_id,)) or {
        "id": test_id,
        "title": "TNPSC Group IV Full Mock Exam 01",
        "category": "TNPSC",
        "department": "Group IV & VAO",
        "positive_mark": 1.5,
        "negative_mark": 0.0
    }

    # Fetch master key questions from database
    questions = query_all("SELECT * FROM omr_questions WHERE test_id = %s ORDER BY q_no ASC", (test_id,))
    
    # If no questions in DB yet, create standard set
    if not questions:
        for i in range(1, 26):
            execute_write(
                """INSERT INTO omr_questions (test_id, q_no, question_text, option_a, option_b, option_c, option_d, correct_key, explanation)
                   VALUES (%s, %s, %s, 'Option A', 'Option B', 'Option C', 'Option D', %s, 'Standard explanation')""",
                (test_id, i, f"Mock Question {i}", ["A", "B", "C", "D"][(i - 1) % 4])
            )
        questions = query_all("SELECT * FROM omr_questions WHERE test_id = %s ORDER BY q_no ASC", (test_id,))

    positive_mark = float(test.get("positive_mark") or 1.5)
    negative_mark = float(test.get("negative_mark") or 0.0)

    correct_count = 0
    incorrect_count = 0
    unshaded_count = 0
    not_known_count = 0
    breakdown = []

    for q in questions:
        q_no = q["q_no"]
        student_choice = candidate_answers.get(str(q_no)) or candidate_answers.get(q_no)
        correct_key = q["correct_key"]

        is_correct = False
        status = "unattempted"

        if not student_choice:
            unshaded_count += 1
            status = "unattempted"
        elif student_choice == "E":
            not_known_count += 1
            status = "not_known"
        elif student_choice.upper() == correct_key.upper():
            correct_count += 1
            is_correct = True
            status = "correct"
        else:
            incorrect_count += 1
            status = "incorrect"

        breakdown.append({
            "qNo": q_no,
            "question": q["question_text"],
            "options": {
                "A": q["option_a"],
                "B": q["option_b"],
                "C": q["option_c"],
                "D": q["option_d"],
                "E": q.get("option_e", "Answer Not Known")
            },
            "studentChoice": student_choice,
            "correctKey": correct_key,
            "isCorrect": is_correct,
            "status": status,
            "explanation": q.get("explanation", "Refer to classroom discussion."),
            "topic": q.get("topic", "General Studies")
        })

    total_q = len(questions)
    total_attempted = correct_count + incorrect_count + not_known_count
    raw_score = max(0.0, (correct_count * positive_mark) - (incorrect_count * negative_mark))
    max_possible = total_q * positive_mark
    percentage = (raw_score / max_possible * 100) if max_possible > 0 else 0.0
    accuracy = (correct_count / total_attempted * 100) if total_attempted > 0 else 0.0

    # Calculate Simulated Statewide Merit Rank
    simulated_rank = max(1, round(1500 * (1 - (percentage / 105))))
    if percentage >= 90:
        simulated_rank = random.randint(1, 10)
    elif percentage >= 75:
        simulated_rank = random.randint(11, 40)
    elif percentage >= 60:
        simulated_rank = random.randint(41, 120)

    cutoff_zone = "Qualifying Zone (Above Expected Cutoff)"
    if percentage < 55:
        cutoff_zone = "Needs Intensive Practice Batch"
    elif percentage < 70:
        cutoff_zone = "Borderline Competitive Zone"

    submission_code = f"OMR-{int(time.time())}-{random.randint(100, 999)}"

    # Insert into MySQL omr_submissions table
    sub_res = execute_write(
        """INSERT INTO omr_submissions (
            submission_code, test_id, student_roll_no, student_name, booklet_series,
            total_questions, total_attempted, correct_count, incorrect_count, unshaded_count, not_known_count,
            raw_score, max_possible_marks, percentage, accuracy, simulated_rank, cutoff_zone, time_spent_seconds
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
        (
            submission_code, test_id, student_roll, student_name, booklet_series,
            total_q, total_attempted, correct_count, incorrect_count, unshaded_count, not_known_count,
            round(raw_score, 2), round(max_possible, 2), round(percentage, 2), round(accuracy, 2),
            simulated_rank, cutoff_zone, time_spent
        )
    )

    sub_id = sub_res.get("last_id")

    # Insert question answers into MySQL omr_submission_answers
    for item in breakdown:
        execute_write(
            """INSERT INTO omr_submission_answers (submission_id, q_no, student_choice, correct_key, is_correct, explanation)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (sub_id, item["qNo"], item["studentChoice"], item["correctKey"], 1 if item["isCorrect"] else 0, item["explanation"])
        )

    response_payload = {
        "status": "success",
        "message": "OMR sheet evaluated and validated successfully",
        "submissionId": submission_code,
        "testId": test_id,
        "testTitle": test.get("title", "Mock Examination"),
        "category": test.get("category", "TNPSC"),
        "department": test.get("department", "Group IV"),
        "rollNo": student_roll,
        "studentName": student_name,
        "bookletSeries": booklet_series,
        "submittedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
        "timeSpentSeconds": time_spent,
        "totalQuestions": total_q,
        "totalAttempted": total_attempted,
        "correctCount": correct_count,
        "incorrectCount": incorrect_count,
        "unshadedCount": unshaded_count,
        "notKnownCount": not_known_count,
        "rawScore": round(raw_score, 2),
        "maxPossibleMarks": round(max_possible, 2),
        "percentage": round(percentage, 1),
        "accuracy": round(accuracy, 1),
        "simulatedRank": simulated_rank,
        "cutoffZone": cutoff_zone,
        "breakdown": breakdown,
        "candidateAnswers": candidate_answers
    }

    return jsonify(response_payload), 200

# =============================================================================
# 3. SUBMISSIONS ROSTER & INSPECTION ENDPOINTS
# =============================================================================

@omr_bp.route("/api/omr/submissions", methods=["GET"])
@omr_bp.route("/omr_submissions_all.php", methods=["GET"])
def get_submissions():
    """Retrieve verified OMR submissions from MySQL (filterable by roll_no)."""
    roll_no = request.args.get("roll_no") or request.args.get("rollNo")
    
    if roll_no:
        subs = query_all(
            """SELECT s.*, t.title as test_title, t.category 
               FROM omr_submissions s 
               LEFT JOIN tests t ON s.test_id = t.id 
               WHERE s.student_roll_no = %s 
               ORDER BY s.id DESC""",
            (roll_no,)
        )
    else:
        subs = query_all(
            """SELECT s.*, t.title as test_title, t.category 
               FROM omr_submissions s 
               LEFT JOIN tests t ON s.test_id = t.id 
               ORDER BY s.id DESC"""
        )

    formatted = []
    for s in subs:
        formatted.append({
            "submissionId": s["submission_code"],
            "id": s["id"],
            "testId": s["test_id"],
            "testTitle": s.get("test_title", "Mock Examination"),
            "category": s.get("category", "TNPSC"),
            "rollNo": s["student_roll_no"],
            "studentName": s["student_name"],
            "bookletSeries": s.get("booklet_series", "A"),
            "rawScore": float(s["raw_score"]),
            "maxPossibleMarks": float(s["max_possible_marks"]),
            "percentage": float(s["percentage"]),
            "accuracy": float(s["accuracy"]),
            "correctCount": s["correct_count"],
            "incorrectCount": s["incorrect_count"],
            "unshadedCount": s["unshaded_count"],
            "simulatedRank": s.get("simulated_rank", 1),
            "cutoffZone": s.get("cutoff_zone", "Evaluated"),
            "submittedAt": str(s.get("submitted_at", ""))
        })

    return jsonify(formatted)

@omr_bp.route("/api/omr/submissions/<string:submission_code>", methods=["GET"])
def get_submission_by_code(submission_code):
    """Retrieve full inspection details including question-by-question candidate answers."""
    sub = query_one(
        """SELECT s.*, t.title as test_title, t.category 
           FROM omr_submissions s 
           LEFT JOIN tests t ON s.test_id = t.id 
           WHERE s.submission_code = %s""",
        (submission_code,)
    )
    if not sub:
        return jsonify({"status": "error", "message": "Submission not found"}), 404

    answers = query_all(
        "SELECT * FROM omr_submission_answers WHERE submission_id = %s ORDER BY q_no ASC",
        (sub["id"],)
    )

    return jsonify({
        "status": "success",
        "submission": {
            "submissionId": sub["submission_code"],
            "testTitle": sub.get("test_title"),
            "category": sub.get("category"),
            "rollNo": sub["student_roll_no"],
            "studentName": sub["student_name"],
            "bookletSeries": sub["booklet_series"],
            "rawScore": float(sub["raw_score"]),
            "maxPossibleMarks": float(sub["max_possible_marks"]),
            "percentage": float(sub["percentage"]),
            "accuracy": float(sub["accuracy"]),
            "correctCount": sub["correct_count"],
            "incorrectCount": sub["incorrect_count"],
            "unshadedCount": sub["unshaded_count"],
            "breakdown": [
                {
                    "qNo": a["q_no"],
                    "studentChoice": a["student_choice"],
                    "correctKey": a["correct_key"],
                    "isCorrect": bool(a["is_correct"]),
                    "explanation": a.get("explanation", "")
                }
                for a in answers
            ]
        }
    })
