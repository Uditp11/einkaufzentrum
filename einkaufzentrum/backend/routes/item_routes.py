from flask import Blueprint, request, jsonify
from models import Item, Category
from extensions import db
from datetime import datetime
from sqlalchemy import or_

item_bp = Blueprint("item", __name__, url_prefix="/api/items")

# Synonym support
SYNONYMS = {
    "laptop": ["Electronics"],
    "bike": ["Bikes"],
    "book": ["Books"],
}

@item_bp.route("/", methods=["GET"])
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
    data = request.get_json()
    required = ["title", "description", "price", "category_id", "seller_id", "media_url"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing fields"}), 400
    
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
    
    return jsonify({"message": "Ad posted and awaiting admin approval"}), 201