import os

# Use a throwaway in-memory database. This must be set before app is imported,
# because Flask-SQLAlchemy creates the engine when the app is set up.
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

import pytest
from app import app, db
from models import User, Item, Report
import json
from datetime import datetime, timedelta
import jwt
from config import Config

@pytest.fixture(scope="module")
def test_client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            # Create admin user
            admin = User(full_name="Admin User", email="admin@example.com", role="Admin", status="Active", joined_date=datetime.utcnow())
            admin.set_password("adminpass")
            db.session.add(admin)
            # Create normal user
            user = User(full_name="Normal User", email="user@example.com", role="User", status="Active", joined_date=datetime.utcnow())
            user.set_password("userpass")
            db.session.add(user)
            db.session.commit()
            # Create posts
            item1 = Item(title="Pending Post", description="desc", price=10, category_id=1, seller_id=user.user_id, media_url="", status="Pending")
            item2 = Item(title="Approved Post", description="desc", price=20, category_id=1, seller_id=user.user_id, media_url="", status="Approved")
            item3 = Item(title="Scam Post", description="desc", price=30, category_id=1, seller_id=user.user_id, media_url="", status="Deleted")
            db.session.add_all([item1, item2, item3])
            db.session.commit()
            # Report the scam post and its seller
            db.session.add(Report(reporter_id=admin.user_id, target_item_id=item3.item_id, target_user_id=user.user_id, reason="Scam"))
            db.session.commit()
        yield client
        with app.app_context():
            db.drop_all()

def get_admin_token():
    payload = {
        'user_id': 1,
        'email': 'admin@example.com',
        'role': 'Admin',
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

def get_user_token():
    payload = {
        'user_id': 2,
        'email': 'user@example.com',
        'role': 'User',
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

def auth_header(token):
    return {'Authorization': f'Bearer {token}'}

def test_dashboard_counts(test_client):
    token = get_admin_token()
    resp = test_client.get('/api/admin/dashboard-counts', headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'postsAwaitingApproval' in data
    assert 'usersReportedAsScam' in data
    assert 'postsMarkedAsScam' in data

def test_dashboard_counts_auth_required(test_client):
    resp = test_client.get('/api/admin/dashboard-counts')
    assert resp.status_code == 401
    token = get_user_token()
    resp = test_client.get('/api/admin/dashboard-counts', headers=auth_header(token))
    assert resp.status_code == 403

def test_posts_pending_approval(test_client):
    token = get_admin_token()
    resp = test_client.get('/api/admin/items/pending', headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.get_json()
    assert any(post['title'] == 'Pending Post' for post in data)

def test_post_detail(test_client):
    token = get_admin_token()
    resp = test_client.get('/api/admin/items/pending/1', headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['title'] == 'Pending Post'
    resp = test_client.get('/api/admin/items/pending/999', headers=auth_header(token))
    assert resp.status_code == 404

def test_approve_post(test_client):
    token = get_admin_token()
    # Approve pending post
    resp = test_client.post('/api/admin/items/approve/1', headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'approved' in data['message']
    # Approve already approved post
    resp = test_client.post('/api/admin/items/approve/2', headers=auth_header(token))
    assert resp.status_code == 200

def test_reject_post(test_client):
    token = get_admin_token()
    # Reject a post
    resp = test_client.post('/api/admin/items/reject/2', headers=auth_header(token), json={"reason": "Spam"})
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'rejected' in data['message']
    # Reject non-existent post
    resp = test_client.post('/api/admin/items/reject/999', headers=auth_header(token), json={"reason": "Spam"})
    assert resp.status_code == 404

def test_reported_users(test_client):
    token = get_admin_token()
    resp = test_client.get('/api/admin/users/reported', headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.get_json()
    assert any(u['name'] == 'Normal User' for u in data)

def test_reported_user_detail(test_client):
    token = get_admin_token()
    resp = test_client.get('/api/admin/users/reported/2', headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['name'] == 'Normal User'
    resp = test_client.get('/api/admin/users/reported/999', headers=auth_header(token))
    assert resp.status_code == 404

def test_ban_user(test_client):
    token = get_admin_token()
    resp = test_client.post('/api/admin/users/ban/2', headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'banned' in data['message']
    # Ban non-existent user
    resp = test_client.post('/api/admin/users/ban/999', headers=auth_header(token))
    assert resp.status_code == 404

def test_delete_user(test_client):
    token = get_admin_token()
    # Add user again for delete test
    with app.app_context():
        user = User(full_name="Delete User", email="delete@example.com", role="User", status="Active", joined_date=datetime.utcnow())
        user.set_password("deletepass")
        db.session.add(user)
        db.session.commit()
        user_id = user.user_id
    resp = test_client.delete(f'/api/admin/users/delete/{user_id}', headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'deleted' in data['message']
    # Delete non-existent user
    resp = test_client.delete('/api/admin/users/delete/999', headers=auth_header(token))
    assert resp.status_code == 404

def test_posts_marked_scam(test_client):
    token = get_admin_token()
    resp = test_client.get('/api/admin/items/reported', headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.get_json()
    assert any(post['title'] == 'Scam Post' for post in data) 