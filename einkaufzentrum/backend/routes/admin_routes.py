from flask import Blueprint, request, jsonify
from extensions import db
from models import Item, User, Report
from config import Config
import jwt
from datetime import datetime
from functools import wraps
from werkzeug.exceptions import HTTPException

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# Custom authentication and role check decorator
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            
            if not current_user or current_user.status != 'Active':
                return jsonify({'error': 'Invalid or inactive user'}), 401
                
            if current_user.role != 'Admin':
                return jsonify({'error': 'Admin privileges required'}), 403
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'error': str(e)}), 500

        return f(current_user, *args, **kwargs)

    return decorated

# 1. Dashboard counts
@admin_bp.route("/dashboard-counts", methods=["GET"])
@admin_required
def dashboard_counts(current_user):
    try:
        posts_awaiting = Item.query.filter_by(status='Pending').count()
        
        reported_users = db.session.query(Report.target_user_id)\
            .filter(Report.target_user_id.isnot(None))\
            .distinct().count()
            
        reported_posts = db.session.query(Report.target_item_id)\
            .filter(Report.target_item_id.isnot(None))\
            .distinct().count()

        return jsonify({
            "postsAwaitingApproval": posts_awaiting,
            "usersReportedAsScam": reported_users,
            "postsMarkedAsScam": reported_posts
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 2. Get pending items
@admin_bp.route("/items/pending", methods=["GET"])
@admin_required
def get_pending_items(current_user):
    try:
        items = Item.query.filter_by(status='Pending').order_by(Item.date_posted.desc()).all()
        # Include seller details
        result = []
        for item in items:
            item_dict = item.to_dict()
            seller = User.query.get(item.seller_id)
            item_dict["seller_name"] = seller.full_name if seller else "Unknown"
            result.append(item_dict)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 3. Get specific pending item details
@admin_bp.route("/items/pending/<int:item_id>", methods=["GET"])
@admin_required
def get_pending_item_detail(current_user, item_id):
    try:
        item = Item.query.filter_by(item_id=item_id, status='Pending').first_or_404()
        item_dict = item.to_dict()
        seller = User.query.get(item.seller_id)
        item_dict["seller_name"] = seller.full_name if seller else "Unknown"
        return jsonify(item_dict), 200
    except HTTPException:
        raise  # let get_or_404 return 404, not 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 4. Approve pending item
@admin_bp.route("/items/approve/<int:item_id>", methods=["POST"])
@admin_required
def approve_item(current_user, item_id):
    try:
        item = Item.query.get_or_404(item_id)
        item.status = 'Approved'
        db.session.commit()
        return jsonify({"message": f"Listing '{item.title}' approved successfully"}), 200
    except HTTPException:
        raise  # let get_or_404 return 404, not 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# 5. Reject/Delete pending item
@admin_bp.route("/items/reject/<int:item_id>", methods=["POST"])
@admin_required
def reject_item(current_user, item_id):
    try:
        item = Item.query.get_or_404(item_id)
        # We can also read the reason from the request if sent
        data = request.get_json() or {}
        reason = data.get("reason", "Inappropriate content")
        
        # Set status to Deleted or remove it
        item.status = 'Deleted'
        
        # Optionally delete/dismiss any reports for this item as well
        Report.query.filter_by(target_item_id=item_id).delete()
        
        db.session.commit()
        return jsonify({"message": f"Listing '{item.title}' rejected and deleted. Reason: {reason}"}), 200
    except HTTPException:
        raise  # let get_or_404 return 404, not 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# 6. Get reported items (marked as scam)
@admin_bp.route("/items/reported", methods=["GET"])
@admin_required
def get_reported_items(current_user):
    try:
        # Join with reports to find items that have reports
        items = Item.query.join(Report, Item.item_id == Report.target_item_id).distinct().all()
        result = []
        for item in items:
            item_dict = item.to_dict()
            seller = User.query.get(item.seller_id)
            item_dict["seller_name"] = seller.full_name if seller else "Unknown"
            
            # Fetch report reasons and reporter names
            item_reports = Report.query.filter_by(target_item_id=item.item_id).all()
            item_dict["reports"] = [r.to_dict() for r in item_reports]
            result.append(item_dict)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 7. Dismiss reports for an item
@admin_bp.route("/items/dismiss-reports/<int:item_id>", methods=["POST"])
@admin_required
def dismiss_item_reports(current_user, item_id):
    try:
        Report.query.filter_by(target_item_id=item_id).delete()
        db.session.commit()
        return jsonify({"message": "Reports dismissed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# 8. Get reported users
@admin_bp.route("/users/reported", methods=["GET"])
@admin_required
def get_reported_users(current_user):
    try:
        # Find users who have at least one report
        users = User.query.join(Report, User.user_id == Report.target_user_id).distinct().all()
        result = []
        for u in users:
            reports_count = Report.query.filter_by(target_user_id=u.user_id).count()
            result.append({
                "id": u.user_id,
                "name": u.full_name,
                "email": u.email,
                "status": u.status,
                "reports": reports_count
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 9. Get detailed user report info
@admin_bp.route("/users/reported/<int:user_id>", methods=["GET"])
@admin_required
def get_reported_user_detail(current_user, user_id):
    try:
        u = User.query.get_or_404(user_id)
        total_posts = Item.query.filter_by(seller_id=user_id).count()
        
        # Count scam posts by looking at reported items belonging to this seller
        scam_posts = Item.query.join(Report, Item.item_id == Report.target_item_id)\
            .filter(Item.seller_id == user_id).distinct().count()
            
        reports = Report.query.filter_by(target_user_id=user_id).all()
        
        return jsonify({
            "id": u.user_id,
            "name": u.full_name,
            "email": u.email,
            "memberSince": u.joined_date.strftime('%Y-%m-%d') if u.joined_date else "Unknown",
            "status": u.status,
            "totalPosts": total_posts,
            "scamPosts": scam_posts,
            "avatar": f"https://api.dicebear.com/7.x/adventurer/svg?seed={u.email}",
            "reports": [r.to_dict() for r in reports]
        }), 200
    except HTTPException:
        raise  # let get_or_404 return 404, not 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 10. Ban reported user
@admin_bp.route("/users/ban/<int:user_id>", methods=["POST"])
@admin_required
def ban_user(current_user, user_id):
    try:
        u = User.query.get_or_404(user_id)
        u.status = 'Banned'
        
        # Hide all listings of this user
        Item.query.filter_by(seller_id=user_id).update({"status": "Deleted"})
        
        db.session.commit()
        return jsonify({"message": f"User {u.full_name} has been banned and their listings hidden."}), 200
    except HTTPException:
        raise  # let get_or_404 return 404, not 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# 11. Delete user permanently
@admin_bp.route("/users/delete/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(current_user, user_id):
    try:
        u = User.query.get_or_404(user_id)
        
        # Safely delete references to prevent foreign key errors
        # Delete reports where the user is reporter, target_user, or target_item belongs to user
        Report.query.filter(
            (Report.reporter_id == user_id) | 
            (Report.target_user_id == user_id) | 
            (Report.target_item_id.in_(db.session.query(Item.item_id).filter_by(seller_id=user_id)))
        ).delete(synchronize_session=False)
        
        # Delete items posted by the user
        Item.query.filter_by(seller_id=user_id).delete(synchronize_session=False)
        
        # Finally delete the user
        db.session.delete(u)
        db.session.commit()
        return jsonify({"message": f"User {u.full_name} deleted permanently."}), 200
    except HTTPException:
        raise  # let get_or_404 return 404, not 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
