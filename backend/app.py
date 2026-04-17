import logging
import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from routes.health   import health_bp
from routes.predict  import predict_bp
from routes.train    import train_bp
from routes.download import download_bp
from routes.students import students_bp
from routes.user_routes import user_bp
from utils.auth_middleware import init_firebase
from utils.model_utils import load_model
from models.student_model import db
from dotenv import load_dotenv

# Load env variables from .env
load_dotenv()

# Setting up basic logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

def create_app() -> Flask:
    """Application factory for the ScholarMetrics API."""
    # Determine frontend directory for static serving
    # Fallback to current directory if parent structure isn't matched
    current_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.abspath(os.path.join(current_dir, '..', 'frontend', 'dist'))
    
    if os.path.exists(frontend_dir):
        app = Flask(__name__, static_folder=frontend_dir, static_url_path='/')
        logger.info(f"Serving static files from: {frontend_dir}")
    else:
        app = Flask(__name__)
        logger.warning(f"Static folder NOT FOUND at {frontend_dir}. Skipping static serving.")
    
    # Set up CORS - prioritize specific origins from env, or fallback to "*"
    raw_origins = os.environ.get("ALLOWED_ORIGINS", "*")
    if raw_origins == "*":
        allowed_origins = "*"
    else:
        # Strip spaces and remove empty strings to prevent CORS failures due to bad formatting
        allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
    
    CORS(app, resources={r"/*": {"origins": allowed_origins}})
    logger.info(f"CORS initialized with: {allowed_origins}")

    # Database setup - ensure protocol compatibility for SQLAlchemy 1.4+
    db_url = os.environ.get("DATABASE_URL")
    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        logger.info("Updated DATABASE_URL protocol from postgres:// to postgresql://")
    
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    try:
        db.init_app(app)
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")

    # Initialize Firebase Admin
    init_firebase()

    # Create tables (UserProfile)
    with app.app_context():
        try:
            db.create_all()
            logger.info("Database tables created successfully.")
        except Exception as e:
            logger.error(f"SQLAlchemy create_all failed: {e}")
            # We don't crash here, but functionality will be limited

    # Load model on startup
    try:
        model = load_model()
        app.extensions["model"] = model
        logger.info("Model loaded successfully.")
    except FileNotFoundError as exc:
        logger.error(f"Failed to load model: {exc}")
        app.extensions["model"] = None

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(predict_bp)
    app.register_blueprint(train_bp)
    app.register_blueprint(download_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(user_bp, url_prefix='/api')

    # Standard error handlers
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad request", "message": str(e)}), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Route not found", "message": str(e)}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "Method not allowed", "message": str(e)}), 405

    @app.errorhandler(500)
    def internal_error(e):
        logger.exception("Unexpected server error")
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, "index.html")

    @app.before_request
    def check_model():
        from flask import request as req
        # Guard routes that require a trained model
        guarded = ("/predict", "/download-report", "/train")
        if req.path in guarded and app.extensions.get("model") is None:
            return jsonify({
                "error": "Model not ready",
                "message": "Please train the model using `python models/train_model.py` first."
            }), 503

    return app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app = create_app()
    app.run(host="0.0.0.0", port=port, debug=debug)
