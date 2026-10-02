"""
Bharathi Thervukalam - Course & Syllabus API Routes
Handles TNPSC (Group 1, 2, 2A, 4) and TNUSRB (Joint SI, SI Tech, SI Fingerprint, Common PC)
CRUD operations, PDF syllabus attachments, and Payment orders.
"""

import os
import random
from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from database import query_all, query_one, execute_write
from config import Config

courses_bp = Blueprint("courses", __name__)

# Mapping between frontend courseKeys and database identifiers
COURSE_CONFIGS = {
    "group1": {"category": "TNPSC", "exam_type": "TNPSC Group I Services", "dept": "Civil Services"},
    "group2": {"category": "TNPSC", "exam_type": "TNPSC Group II Services", "dept": "Interview Posts"},
    "group2A": {"category": "TNPSC", "exam_type": "TNPSC Group II-A Services", "dept": "Non-Interview Ministerial"},
    "group4": {"category": "TNPSC", "exam_type": "TNPSC Group IV & VAO", "dept": "Village Admin & Clerical"},
    "jointRecruitment": {"category": "TNUSRB", "exam_type": "Joint Recruitment (SIs & SO)", "dept": "Taluk & Armed Reserve"},
    "siTechnical": {"category": "TNUSRB", "exam_type": "Sub-Inspector (Technical)", "dept": "Police Wireless Wing"},
    "siFingerprint": {"category": "TNUSRB", "exam_type": "Sub-Inspector (Finger Print)", "dept": "Forensic Bureau Cadre"},
    "commonRecruitment": {"category": "TNUSRB", "exam_type": "Common Recruitment (Gr. II Constables)", "dept": "Uniformed Services"},
}

def save_uploaded_file(file):
    """Save uploaded syllabus PDF."""
    if not file or not file.filename:
        return None, None
    filename = secure_filename(file.filename)
    dest_path = os.path.join(Config.UPLOAD_FOLDER, filename)
    file.save(dest_path)
    return filename, dest_path

def get_course_items(course_key):
    """Retrieve all syllabus records for a specific courseKey."""
    items = query_all(
        "SELECT * FROM courses_syllabus WHERE course_key = %s ORDER BY id DESC",
        (course_key,)
    )
    if not items:
        cfg = COURSE_CONFIGS.get(course_key, {"category": "TNPSC", "exam_type": "Services", "dept": "General"})
        return [
            {
                "id": 1,
                "syllabus": f"{cfg['exam_type']} Complete Syllabus & Study Scheme (Tamil & English)",
                "title": f"{cfg['exam_type']} Curriculum Standard",
                "filename": f"{course_key}_official_syllabus.pdf",
                "category": cfg["category"],
                "department": cfg["dept"]
            }
        ]
    result = []
    for itm in items:
        result.append({
            "id": itm["id"],
            "syllabus": itm["syllabus_title"],
            "title": itm["syllabus_title"],
            "category": itm["category"],
            "exam_type": itm["exam_type"],
            "department": itm["department"],
            "filename": itm.get("pdf_filename") or f"{course_key}_syllabus.pdf",
            "created_at": str(itm.get("created_at", ""))
        })
    return result

def add_course_item(course_key):
    """Handle adding a syllabus record."""
    cfg = COURSE_CONFIGS.get(course_key, {"category": "TNPSC", "exam_type": "Course", "dept": "General"})
    
    title = request.form.get("syllabus") or request.form.get("title")
    if not title and request.is_json:
        data = request.get_json(silent=True) or {}
        title = data.get("syllabus") or data.get("title")

    if not title:
        title = f"{cfg['exam_type']} Updated Examination Module"

    file = request.files.get("file")
    filename, filepath = save_uploaded_file(file)
    if not filename:
        filename = f"{course_key}_curriculum.pdf"

    res = execute_write(
        """INSERT INTO courses_syllabus (course_key, category, exam_type, department, syllabus_title, pdf_filename, pdf_path)
           VALUES (%s, %s, %s, %s, %s, %s, %s)""",
        (course_key, cfg["category"], cfg["exam_type"], cfg["dept"], title, filename, filepath)
    )
    return jsonify({
        "status": "success",
        "message": f"Syllabus item added to {cfg['exam_type']}",
        "id": res.get("last_id"),
        "title": title
    }), 201

def update_course_item(course_key, item_id):
    """Update syllabus title / file."""
    title = request.form.get("syllabus") or request.form.get("title")
    if not title and request.is_json:
        data = request.get_json(silent=True) or {}
        title = data.get("syllabus") or data.get("title")

    file = request.files.get("file")
    filename, filepath = save_uploaded_file(file)

    if filename:
        execute_write(
            "UPDATE courses_syllabus SET syllabus_title = %s, pdf_filename = %s, pdf_path = %s WHERE id = %s",
            (title, filename, filepath, item_id)
        )
    else:
        execute_write(
            "UPDATE courses_syllabus SET syllabus_title = %s WHERE id = %s",
            (title, item_id)
        )

    return jsonify({"status": "success", "message": "Syllabus updated successfully"})

def delete_course_item(item_id):
    """Delete syllabus entry."""
    execute_write("DELETE FROM courses_syllabus WHERE id = %s", (item_id,))
    return jsonify({"status": "success", "message": "Record deleted successfully"})

# =============================================================================
# TNPSC GROUP ENDPOINTS (Both clean REST /api/courses/<group> and legacy .php)
# =============================================================================

# Group 1
@courses_bp.route("/group1_all.php", methods=["GET"])
@courses_bp.route("/api/courses/group1", methods=["GET"])
def get_group1():
    return jsonify(get_course_items("group1"))

@courses_bp.route("/group1_save.php", methods=["POST"])
@courses_bp.route("/api/courses/group1", methods=["POST"])
def save_group1():
    return add_course_item("group1")

@courses_bp.route("/group1_update.php", methods=["POST", "PUT"])
@courses_bp.route("/api/courses/group1/<int:item_id>", methods=["PUT", "POST"])
def update_group1(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return update_course_item("group1", item_id)

@courses_bp.route("/group1_delete.php", methods=["DELETE", "POST"])
@courses_bp.route("/api/courses/group1/<int:item_id>", methods=["DELETE"])
def delete_group1(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return delete_course_item(item_id)

# Group 2
@courses_bp.route("/group2_all.php", methods=["GET"])
@courses_bp.route("/api/courses/group2", methods=["GET"])
def get_group2():
    return jsonify(get_course_items("group2"))

@courses_bp.route("/group2_save.php", methods=["POST"])
@courses_bp.route("/api/courses/group2", methods=["POST"])
def save_group2():
    return add_course_item("group2")

@courses_bp.route("/group2_update.php", methods=["POST", "PUT"])
@courses_bp.route("/api/courses/group2/<int:item_id>", methods=["PUT", "POST"])
def update_group2(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return update_course_item("group2", item_id)

@courses_bp.route("/group2_delete.php", methods=["DELETE", "POST"])
@courses_bp.route("/api/courses/group2/<int:item_id>", methods=["DELETE"])
def delete_group2(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return delete_course_item(item_id)

# Group 2A
@courses_bp.route("/group2A_all.php", methods=["GET"])
@courses_bp.route("/api/courses/group2A", methods=["GET"])
def get_group2A():
    return jsonify(get_course_items("group2A"))

@courses_bp.route("/group2A_save.php", methods=["POST"])
@courses_bp.route("/api/courses/group2A", methods=["POST"])
def save_group2A():
    return add_course_item("group2A")

@courses_bp.route("/group2A_update.php", methods=["POST", "PUT"])
@courses_bp.route("/api/courses/group2A/<int:item_id>", methods=["PUT", "POST"])
def update_group2A(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return update_course_item("group2A", item_id)

@courses_bp.route("/group2A_delete.php", methods=["DELETE", "POST"])
@courses_bp.route("/api/courses/group2A/<int:item_id>", methods=["DELETE"])
def delete_group2A(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return delete_course_item(item_id)

# Group 4
@courses_bp.route("/group4_all.php", methods=["GET"])
@courses_bp.route("/api/courses/group4", methods=["GET"])
def get_group4():
    return jsonify(get_course_items("group4"))

@courses_bp.route("/group4_save.php", methods=["POST"])
@courses_bp.route("/api/courses/group4", methods=["POST"])
def save_group4():
    return add_course_item("group4")

@courses_bp.route("/group4_update.php", methods=["POST", "PUT"])
@courses_bp.route("/api/courses/group4/<int:item_id>", methods=["PUT", "POST"])
def update_group4(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return update_course_item("group4", item_id)

@courses_bp.route("/group4_delete.php", methods=["DELETE", "POST"])
@courses_bp.route("/api/courses/group4/<int:item_id>", methods=["DELETE"])
def delete_group4(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return delete_course_item(item_id)

@courses_bp.route("/group4_download.php", methods=["GET"])
@courses_bp.route("/api/courses/group4/<int:item_id>/download", methods=["GET"])
def download_group4(item_id=None):
    return jsonify({"status": "success", "message": "Group 4 syllabus download ready"})

# =============================================================================
# TNUSRB POLICE ENDPOINTS
# =============================================================================

# Joint Recruitment SI
@courses_bp.route("/join_view.php", methods=["GET"])
@courses_bp.route("/api/courses/jointRecruitment", methods=["GET"])
def get_join():
    return jsonify(get_course_items("jointRecruitment"))

@courses_bp.route("/join_save.php", methods=["POST"])
@courses_bp.route("/api/courses/jointRecruitment", methods=["POST"])
def save_join():
    return add_course_item("jointRecruitment")

@courses_bp.route("/join_update.php", methods=["POST", "PUT"])
@courses_bp.route("/api/courses/jointRecruitment/<int:item_id>", methods=["PUT", "POST"])
def update_join(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return update_course_item("jointRecruitment", item_id)

@courses_bp.route("/join_delete.php", methods=["DELETE", "POST"])
@courses_bp.route("/api/courses/jointRecruitment/<int:item_id>", methods=["DELETE"])
def delete_join(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return delete_course_item(item_id)

@courses_bp.route("/join_download.php", methods=["GET"])
@courses_bp.route("/api/courses/jointRecruitment/<int:item_id>/download", methods=["GET"])
def download_join(item_id=None):
    return jsonify({"status": "success", "message": "Joint recruitment syllabus ready"})

# SI Technical
@courses_bp.route("/technical_view.php", methods=["GET"])
@courses_bp.route("/api/courses/siTechnical", methods=["GET"])
def get_technical():
    return jsonify(get_course_items("siTechnical"))

@courses_bp.route("/technical_save.php", methods=["POST"])
@courses_bp.route("/api/courses/siTechnical", methods=["POST"])
def save_technical():
    return add_course_item("siTechnical")

@courses_bp.route("/technical_update.php", methods=["POST", "PUT"])
@courses_bp.route("/api/courses/siTechnical/<int:item_id>", methods=["PUT", "POST"])
def update_technical(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return update_course_item("siTechnical", item_id)

@courses_bp.route("/technical_delete.php", methods=["DELETE", "POST"])
@courses_bp.route("/api/courses/siTechnical/<int:item_id>", methods=["DELETE"])
def delete_technical(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return delete_course_item(item_id)

@courses_bp.route("/technical_download.php", methods=["GET"])
@courses_bp.route("/api/courses/siTechnical/<int:item_id>/download", methods=["GET"])
def download_technical(item_id=None):
    return jsonify({"status": "success", "message": "SI Technical syllabus ready"})

# SI Fingerprint
@courses_bp.route("/fingerprints_view.php", methods=["GET"])
@courses_bp.route("/api/courses/siFingerprint", methods=["GET"])
def get_fingerprints():
    return jsonify(get_course_items("siFingerprint"))

@courses_bp.route("/fingerprints_save.php", methods=["POST"])
@courses_bp.route("/api/courses/siFingerprint", methods=["POST"])
def save_fingerprints():
    return add_course_item("siFingerprint")

@courses_bp.route("/fingerprints_update.php", methods=["POST", "PUT"])
@courses_bp.route("/api/courses/siFingerprint/<int:item_id>", methods=["PUT", "POST"])
def update_fingerprints(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return update_course_item("siFingerprint", item_id)

@courses_bp.route("/fingerprints_delete.php", methods=["DELETE", "POST"])
@courses_bp.route("/api/courses/siFingerprint/<int:item_id>", methods=["DELETE"])
def delete_fingerprints(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return delete_course_item(item_id)

@courses_bp.route("/fingerprints_download.php", methods=["GET"])
@courses_bp.route("/api/courses/siFingerprint/<int:item_id>/download", methods=["GET"])
def download_fingerprints(item_id=None):
    return jsonify({"status": "success", "message": "SI Fingerprint syllabus ready"})

# Common Recruitment (PC)
@courses_bp.route("/tnusrbs_view.php", methods=["GET"])
@courses_bp.route("/api/courses/commonRecruitment", methods=["GET"])
def get_common():
    return jsonify(get_course_items("commonRecruitment"))

@courses_bp.route("/tnusrbs_save.php", methods=["POST"])
@courses_bp.route("/api/courses/commonRecruitment", methods=["POST"])
def save_common():
    return add_course_item("commonRecruitment")

@courses_bp.route("/tnusrbs_update.php", methods=["POST", "PUT"])
@courses_bp.route("/api/courses/commonRecruitment/<int:item_id>", methods=["PUT", "POST"])
def update_common(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return update_course_item("commonRecruitment", item_id)

@courses_bp.route("/tnusrbs_delete.php", methods=["DELETE", "POST"])
@courses_bp.route("/api/courses/commonRecruitment/<int:item_id>", methods=["DELETE"])
def delete_common(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return delete_course_item(item_id)

@courses_bp.route("/tnusrbs_download.php", methods=["GET"])
@courses_bp.route("/api/courses/commonRecruitment/<int:item_id>/download", methods=["GET"])
def download_common(item_id=None):
    return jsonify({"status": "success", "message": "Common recruitment syllabus ready"})

# =============================================================================
# GENERAL SYLLABUS & PAYMENT ENDPOINTS
# =============================================================================

@courses_bp.route("/syllabus_all.php", methods=["GET"])
@courses_bp.route("/api/syllabus", methods=["GET"])
def get_all_syllabus():
    items = query_all("SELECT * FROM courses_syllabus ORDER BY id DESC")
    return jsonify(items)

@courses_bp.route("/syllabus_upload.php", methods=["POST"])
@courses_bp.route("/api/syllabus", methods=["POST"])
def upload_syllabus():
    return add_course_item("group4")

@courses_bp.route("/syllabus_update.php", methods=["POST", "PUT"])
@courses_bp.route("/api/syllabus/<int:item_id>", methods=["PUT", "POST"])
def update_syllabus(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return update_course_item("group4", item_id)

@courses_bp.route("/syllabus_delete.php", methods=["DELETE", "POST"])
@courses_bp.route("/api/syllabus/<int:item_id>", methods=["DELETE"])
def delete_syllabus(item_id=None):
    if item_id is None:
        item_id = request.args.get("id")
    return delete_course_item(item_id)

@courses_bp.route("/syllabus_download.php", methods=["GET"])
@courses_bp.route("/api/syllabus/<int:item_id>/download", methods=["GET"])
def download_syllabus(item_id=None):
    return jsonify({"status": "success", "message": "Syllabus download initiated"})

@courses_bp.route("/payment_order.php", methods=["POST"])
@courses_bp.route("/api/payment/create-order", methods=["POST"])
def payment_order():
    data = request.get_json(silent=True) or request.form.to_dict()
    amount = data.get("amount", 1)
    order_id = f"order_{random.randint(10000000, 99999999)}"
    return jsonify({
        "status": "success",
        "order_id": order_id,
        "amount": amount,
        "currency": "INR",
        "key": "rzp_test_mock_bharathi"
    })
