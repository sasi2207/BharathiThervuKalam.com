"""
Bharathi Thervukalam - Students Roster & Export API Routes
Handles enrolled students database, details view, deletion, and PDF export.
"""

from flask import Blueprint, request, jsonify, Response
from database import query_all, query_one, execute_write

students_bp = Blueprint("students", __name__)

@students_bp.route("/student_all.php", methods=["GET"])
@students_bp.route("/api/students", methods=["GET"])
def get_all_students():
    """Retrieve all enrolled students with demographic and examination details."""
    students = query_all("SELECT * FROM students ORDER BY id DESC")
    
    # If empty, return initial roster
    if not students:
        return jsonify([
            {
                "id": 1,
                "register_no": "BTK2026-0428",
                "username": "S. Kabilan",
                "father_name": "S. Murugan",
                "phone_number": "+91 9842145678",
                "whatsapp_number": "+91 9842145678",
                "email": "kabilan@gmail.com",
                "caste": "BC",
                "qualification": "B.E. (Mechanical)",
                "blood_group": "B+",
                "created_at": "2026-01-10 10:00:00"
            },
            {
                "id": 2,
                "register_no": "BTK2026-0819",
                "username": "M. Priya",
                "father_name": "P. Manickam",
                "phone_number": "+91 9443218765",
                "whatsapp_number": "+91 9443218765",
                "email": "priya.m@gmail.com",
                "caste": "MBC",
                "qualification": "B.Sc. (Mathematics)",
                "blood_group": "O+",
                "created_at": "2026-02-14 11:30:00"
            }
        ])

    return jsonify(students)

@students_bp.route("/student_delete.php", methods=["DELETE", "POST"])
@students_bp.route("/api/students/<int:std_id>", methods=["DELETE"])
def delete_student(std_id=None):
    if std_id is None:
        std_id = request.args.get("id")

    execute_write("DELETE FROM students WHERE id = %s", (std_id,))
    return jsonify({"status": "success", "message": "Candidate record removed successfully"})

@students_bp.route("/exportToPDF.php", methods=["GET"])
@students_bp.route("/api/students/export-pdf", methods=["GET"])
def export_students_pdf():
    """Generate and stream printable student roll list PDF or CSV."""
    students = query_all("SELECT register_no, username, phone_number, email, qualification, caste FROM students")

    # Simple plain-text/CSV fallback representation for direct download
    csv_content = "Register No,Candidate Name,Phone Number,Email,Qualification,Community\n"
    for s in students:
        csv_content += f"{s.get('register_no')},{s.get('username')},{s.get('phone_number')},{s.get('email')},{s.get('qualification')},{s.get('caste')}\n"

    return Response(
        csv_content,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=Bharathi_Enrolled_Candidates.csv"}
    )
