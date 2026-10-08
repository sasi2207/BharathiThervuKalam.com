"""
Bharathi Thervukalam - Faculty & Mentors API Routes
Handles instructor directories, designations, and mentor assignments.
"""

from flask import Blueprint, request, jsonify
from database import query_all, query_one, execute_write

faculty_bp = Blueprint("faculty", __name__)

@faculty_bp.route("/staff_view_all.php", methods=["GET"])
@faculty_bp.route("/api/faculty", methods=["GET"])
def get_all_faculty():
    """Retrieve all faculty and mentors."""
    faculty = query_all("SELECT * FROM faculty ORDER BY id ASC")
    
    # If empty, return initial roster
    if not faculty:
        from config import Config
        return jsonify([
            {
                "id": 1,
                "name": "Chakarvarthy",
                "username": "Chakarvarthy",
                "designation": "Founder & Chief Mentor",
                "paper": "Paper II & III",
                "subject": "Tamil Nadu Administration, Indian Polity & Current Affairs",
                "experience": "7+ Years Guidance · State Service Officer",
                "phone": "+91 7338757194"
            },
            {
                "id": 2,
                "name": "Kannan",
                "username": "Kannan",
                "designation": "Senior Faculty & Coordinator",
                "paper": "Paper I & GS",
                "subject": "General Studies, History & Indian National Movement",
                "experience": "State Service Specialist",
                "phone": "+91 8012194136"
            }
        ])

    return jsonify(faculty)

@faculty_bp.route("/faculty_save.php", methods=["POST"])
@faculty_bp.route("/api/faculty", methods=["POST"])
def save_faculty():
    data = request.form.to_dict() if request.form else (request.get_json(silent=True) or {})
    name = data.get("name", "").strip()
    designation = data.get("designation", "Faculty Mentor").strip()
    subject = data.get("subject", "General Studies").strip()

    if not name:
        return jsonify({"status": "error", "message": "Faculty name is required"}), 400

    res = execute_write(
        """INSERT INTO faculty (name, username, designation, paper, subject, experience, phone, email)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
        (
            name,
            data.get("username", name.lower().replace(" ", "_")),
            designation,
            data.get("paper", ""),
            subject,
            data.get("experience", "State Service Faculty"),
            data.get("phone", "+91 7338757194"),
            data.get("email", "")
        )
    )
    return jsonify({
        "status": "success",
        "message": "Faculty added successfully",
        "faculty_id": res.get("last_id")
    }), 201

@faculty_bp.route("/faculty_update.php", methods=["POST", "PUT"])
@faculty_bp.route("/api/faculty/<int:fac_id>", methods=["PUT"])
def update_faculty(fac_id=None):
    if fac_id is None:
        fac_id = request.args.get("id")

    data = request.form.to_dict() if request.form else (request.get_json(silent=True) or {})
    execute_write(
        """UPDATE faculty SET 
            name = COALESCE(%s, name),
            designation = COALESCE(%s, designation),
            subject = COALESCE(%s, subject),
            paper = COALESCE(%s, paper),
            experience = COALESCE(%s, experience),
            phone = COALESCE(%s, phone)
        WHERE id = %s""",
        (
            data.get("name"),
            data.get("designation"),
            data.get("subject"),
            data.get("paper"),
            data.get("experience"),
            data.get("phone"),
            fac_id
        )
    )
    return jsonify({"status": "success", "message": "Faculty record updated successfully"})

@faculty_bp.route("/faculty_delete.php", methods=["DELETE", "POST"])
@faculty_bp.route("/api/faculty/<int:fac_id>", methods=["DELETE"])
def delete_faculty(fac_id=None):
    if fac_id is None:
        fac_id = request.args.get("id")

    execute_write("DELETE FROM faculty WHERE id = %s", (fac_id,))
    return jsonify({"status": "success", "message": "Faculty record removed successfully"})
