"""
Bharathi Thervukalam - Staff Administration API Routes
Handles staff directory, assignments, roles, and administrative profiles.
"""

from flask import Blueprint, request, jsonify
from database import query_all, query_one, execute_write

staff_bp = Blueprint("staff_mgmt", __name__)

@staff_bp.route("/staff_all.php", methods=["GET"])
@staff_bp.route("/api/staff", methods=["GET"])
def get_all_staff():
    """Retrieve all staff coordinators."""
    staff_list = query_all("SELECT id, name, username, email, phone, role, created_at FROM staff ORDER BY id ASC")
    if not staff_list:
        return jsonify([
            {
                "id": 1,
                "name": "Administrative Coordinator",
                "username": "staff",
                "email": "staff@bharathithervukalam.com",
                "phone": "+91 7338757194",
                "role": "ACADEMIC_COORDINATOR"
            }
        ])
    return jsonify(staff_list)

@staff_bp.route("/staff_update.php", methods=["POST", "PUT"])
@staff_bp.route("/api/staff/<int:stf_id>", methods=["PUT"])
def update_staff(stf_id=None):
    if stf_id is None:
        stf_id = request.args.get("id")

    data = request.form.to_dict() if request.form else (request.get_json(silent=True) or {})
    execute_write(
        """UPDATE staff SET 
            name = COALESCE(%s, name),
            email = COALESCE(%s, email),
            phone = COALESCE(%s, phone),
            role = COALESCE(%s, role)
        WHERE id = %s""",
        (data.get("name"), data.get("email"), data.get("phone"), data.get("role"), stf_id)
    )
    return jsonify({"status": "success", "message": "Staff member updated successfully"})

@staff_bp.route("/staff_delete.php", methods=["DELETE", "POST"])
@staff_bp.route("/api/staff/<int:stf_id>", methods=["DELETE"])
def delete_staff(stf_id=None):
    if stf_id is None:
        stf_id = request.args.get("id")

    execute_write("DELETE FROM staff WHERE id = %s", (stf_id,))
    return jsonify({"status": "success", "message": "Staff record removed successfully"})
