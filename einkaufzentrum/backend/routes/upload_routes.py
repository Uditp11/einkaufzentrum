import boto3, uuid
from flask import Blueprint, request, jsonify, current_app

upload_bp = Blueprint("upload", __name__, url_prefix="/api/upload")

@upload_bp.route("/image", methods=["POST"])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file found"}), 400

    image = request.files['image']
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