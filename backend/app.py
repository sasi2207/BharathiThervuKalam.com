"""
Bharathi Thervukalam - Main Python + MySQL Backend Application
Full-featured API server providing endpoints for Courses, Test Series,
OMR Sheet Validation, Student Management, and Faculty Roster.
"""

import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from database import init_db, DB_ENGINE

# Route Blueprints
from routes.auth_routes import auth_bp
from routes.courses_routes import courses_bp
from routes.tests_routes import tests_bp
from routes.omr_routes import omr_bp
from routes.faculty_routes import faculty_bp
from routes.achievers_routes import achievers_bp
from routes.students_routes import students_bp
from routes.staff_routes import staff_bp

def create_app():
    """Application factory for Flask backend."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable Cross-Origin Resource Sharing (CORS)
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"]
    )

    # Register all modular blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(tests_bp)
    app.register_blueprint(omr_bp)
    app.register_blueprint(faculty_bp)
    app.register_blueprint(achievers_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(staff_bp)

    # Health Check & Root Service Info
    @app.route("/", methods=["GET"])
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "service": "Bharathi Thervukalam Python Backend",
            "status": "online",
            "database_engine": DB_ENGINE,
            "version": "2.0.0",
            "features": [
                "TNPSC & TNUSRB Course Syllabi",
                "Test Series & PDF Question Papers",
                "Automated Digital OMR Sheet Evaluator",
                "Master Answer Key Management",
                "Candidate Performance Analytics",
                "Student & Faculty Directory"
            ]
        }), 200

    # Serve uploaded documents & question papers
    @app.route("/uploads/<path:filename>", methods=["GET"])
    def serve_upload(filename):
        return send_from_directory(Config.UPLOAD_FOLDER, filename)

    # Serve public static assets if needed
    @app.route("/public/<path:filename>", methods=["GET"])
    def serve_public(filename):
        public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))
        return send_from_directory(public_dir, filename)

    # Global Error Handlers
    @app.errorhandler(404)
    def handle_404(e):
        return jsonify({"status": "error", "message": "API endpoint not found"}), 404

    @app.errorhandler(500)
    def handle_500(e):
        return jsonify({"status": "error", "message": "Internal server error", "details": str(e)}), 500

    return app

if __name__ == "__main__":
    print("=" * 70)
    print("  Bharathi Thervukalam - Python & MySQL Backend Starting")
    print(f"  Listening on http://{Config.HOST}:{Config.PORT}")
    print(f"  Target MySQL DB: {Config.MYSQL_HOST}:{Config.MYSQL_PORT}/{Config.MYSQL_DATABASE}")
    print("=" * 70)

    # Initialize schema & database tables
    try:
        init_db()
    except Exception as err:
        print(f"[Warning] DB initialization: {err}")

    app = create_app()
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
