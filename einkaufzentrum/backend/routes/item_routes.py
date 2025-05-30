# routes/item_routes.py
from flask import Blueprint, request, jsonify
from models import Item, Category
from sqlalchemy import or_, and_

item_bp = Blueprint("item", __name__, url_prefix="/api/items")

# Define simple synonyms → category mapping
SYNONYMS = {
    "laptop":      ["Electronics"],
    "notebook":    ["Electronics"],
    "smartphone":  ["Electronics"],
    "phone":       ["Electronics"],
    "tablet":      ["Electronics"],
    "bike":        ["Bikes"],
    "bicycle":     ["Bikes"],
    "book":        ["Books"],
    "textbook":    ["Books"],
}

@item_bp.route("/search", methods=["GET"])
def search_items():
    raw_q = request.args.get("q", "").strip()
    if not raw_q:
        return jsonify([])

    q_lower = raw_q.lower()
    ilike_pattern = f"%{raw_q}%"

    query = Item.query.join(Category, Item.category_id == Category.category_id)

    filters = [
        Item.title.ilike(ilike_pattern),
        Category.name.ilike(ilike_pattern)
    ]

    if q_lower in SYNONYMS:
        for cat_name in SYNONYMS[q_lower]:
            filters.append(Category.name == cat_name)

    query = query.filter(or_(*filters))

    items = query.all()
    return jsonify([item.to_dict() for item in items])