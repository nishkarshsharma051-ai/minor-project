import logging
import os
from flask import Flask, jsonify, send_from_directory

from routes.health   import health_bp
from routes.predict  import predict_bp
from routes.train    import train_bp
from routes.download import download_bp
from utils.model_utils import load_model

# Setting up basic logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

def create_app() -> Flask:
    """Application factory for the ScholarMetrics API."""
    frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
    app = Flask(__name__, static_folder=frontend_dir, static_url_path='/')

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
