import boto3, os, uuid
from flask import Blueprint, request, jsonify, current_app, send_from_directory, url_for
from werkzeug.utils import secure_filename

upload_bp = Blueprint("upload", __name__, url_prefix="/api/upload")

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

@upload_bp.route("/image", methods=["POST"])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file found"}), 400

    image = request.files['image']

    # Without AWS keys, store the image on local disk and serve it from Flask
    if not current_app.config['USE_S3']:
        name = secure_filename(image.filename or "")
        if name.rsplit(".", 1)[-1].lower() not in ALLOWED_EXTENSIONS:
            return jsonify({"error": "Only image files are allowed"}), 400
        filename = f"{uuid.uuid4().hex}_{name}"
        os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
        image.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"image_url": url_for("upload.get_image", filename=filename, _external=True)})

    filename = f"{uuid.uuid4().hex}_{image.filename}"

    s3 = boto3.client(
        "s3",
        aws_access_key_id=current_app.config['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=current_app.config['AWS_SECRET_ACCESS_KEY'],
        region_name=current_app.config['S3_REGION']
    )

    try:
        s3.upload_fileobj(
            image,
            current_app.config['S3_BUCKET'],
            filename,
            ExtraArgs={'ContentType': image.content_type}
        )
        url = f"https://{current_app.config['S3_BUCKET']}.s3.{current_app.config['S3_REGION']}.amazonaws.com/{filename}"
        return jsonify({"image_url": url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@upload_bp.route("/files/<path:filename>", methods=["GET"])
def get_image(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
