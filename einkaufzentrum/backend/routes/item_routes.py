from flask import Blueprint, request, jsonify
from models import Item, Category, Report, User, Message
from extensions import db
from datetime import datetime
from sqlalchemy import or_
from .user_routes import token_required

item_bp = Blueprint("item", __name__, url_prefix="/api/items")

# Synonym support
SYNONYMS = {
    "laptop": ["Electronics"],
    "bike": ["Bikes"],
    "book": ["Books"],
}

@item_bp.route("", methods=["GET"])
def list_all_ads():
    search = request.args.get("search", "").strip()
    query = Item.query.join(Category, Item.category_id == Category.category_id)

    if search:
        q_lower = search.lower()
        ilike_pattern = f"%{search}%"
        filters = [
            Item.title.ilike(ilike_pattern),
            Category.name.ilike(ilike_pattern)
        ]
        if q_lower in SYNONYMS:
            filters += [Category.name == name for name in SYNONYMS[q_lower]]

        query = query.filter(or_(*filters), Item.status == "Approved")
    else:
        query = query.filter(Item.status == "Approved")

    items = query.order_by(Item.date_posted.desc()).all()
    return jsonify([item.to_dict() for item in items])

@item_bp.route("/add", methods=["POST"])
def post_item():
    import subprocess
    import json
    import os

    data = request.get_json()
    required = ["title", "description", "price", "category_id", "seller_id", "media_url"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing fields"}), 400
    
    media_url = data["media_url"]
    
    # Run automated AI spam detection
    is_spam = False
    ai_confidence = 0.0
    try:
        backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        project_dir = os.path.abspath(os.path.join(backend_dir, ".."))
        venv_dir = os.path.join(project_dir, "machine_learning", "venv")
        # Windows venvs keep python in Scripts, Linux and macOS in bin
        ml_python = os.path.join(venv_dir, "Scripts", "python.exe") if os.name == "nt" else os.path.join(venv_dir, "bin", "python")
        classify_script = os.path.join(project_dir, "machine_learning", "classify_image.py")
        
        if os.path.exists(ml_python) and os.path.exists(classify_script):
            result = subprocess.run(
                [ml_python, classify_script, media_url],
                capture_output=True,
                text=True,
                timeout=15
            )
            if result.returncode == 0:
                lines = result.stdout.strip().split("\n")
                json_str = lines[-1]
                pred_data = json.loads(json_str)
                if pred_data.get("success"):
                    is_spam = pred_data.get("is_spam", False)
                    ai_confidence = pred_data.get("score", 0.0)
    except Exception as e:
        print("ML spam check error:", e)

    item = Item(
        title=data["title"],
        description=data["description"],
        price=data["price"],
        category_id=data["category_id"],
        seller_id=data["seller_id"],
        media_url=data["media_url"],
        date_posted=datetime.utcnow(),
        status="Pending"  # All new ads are 'Pending' for admin review
    )
    db.session.add(item)
    db.session.commit()
    
    # Create AI flag report if spam detected
    if is_spam:
        admin_user = User.query.filter_by(role='Admin').first()
        reporter_id = admin_user.user_id if admin_user else item.seller_id
        
        ai_report = Report(
            reporter_id=reporter_id,
            target_item_id=item.item_id,
            reason=f"[AI Moderate Flag] Automated spam detection score: {ai_confidence:.2f}. Listing image classified as inappropriate.",
            status="Pending",
            timestamp=datetime.utcnow()
        )
        db.session.add(ai_report)
        db.session.commit()
        return jsonify({"message": "Ad posted successfully. Flagged by automated AI moderator for review.", "flagged": True}), 201
    
    return jsonify({"message": "Ad posted and awaiting admin approval"}), 201

@item_bp.route("/report/<int:item_id>", methods=["POST"])
@token_required
def report_item(current_user, item_id):
    try:
        target_item = Item.query.get_or_404(item_id)
        data = request.get_json() or {}
        reason = data.get("reason", "").strip()
        
        if not reason:
            return jsonify({"error": "Reason is required"}), 400
            
        report = Report(
            reporter_id=current_user.user_id,
            target_item_id=item_id,
            reason=reason,
            status="Pending",
            timestamp=datetime.utcnow()
        )
        db.session.add(report)
        db.session.commit()
        return jsonify({"message": f"Listing '{target_item.title}' reported successfully."}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@item_bp.route("/buy/<int:item_id>", methods=["POST"])
@token_required
def buy_item(current_user, item_id):
    try:
        item = Item.query.get_or_404(item_id)
        if item.status != 'Approved':
            return jsonify({"error": "Item is not available for purchase"}), 400
            
        data = request.get_json() or {}
        payment_method = data.get("payment_method", "Offline").strip()
        message_content = data.get("message", "").strip()
        
        # Mark item as Sold
        item.status = 'Sold'
        
        # Create coordination message
        try:
            msg = Message(
                sender_id=current_user.user_id,
                receiver_id=item.seller_id,
                item_id=item.item_id,
                content=f"I would like to buy your item '{item.title}' for €{item.price:.2f}. Preferred payment: {payment_method}. Message: {message_content}",
                timestamp=datetime.utcnow(),
                read_status=False
            )
            db.session.add(msg)
        except Exception as e_msg:
            print("Failed to log message in DB:", e_msg)
            
        db.session.commit()
        return jsonify({
            "message": f"Purchase request for '{item.title}' submitted successfully!",
            "seller_id": item.seller_id,
            "payment_method": payment_method
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500