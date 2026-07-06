import os
import sys
import threading
import time
import requests

# Adjust path to include backend files
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import app
from extensions import db
from models import User, Item, Report

PORT = 5055
BASE_URL = f"http://127.0.0.1:{PORT}"

def run_server():
    """Runs the Flask server in a separate thread."""
    app.run(host="127.0.0.1", port=PORT, debug=False, use_reloader=False)

def main():
    # Start the server in a background thread
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    
    # Wait for the server to spin up
    time.sleep(2)
    
    print("\n=============================================")
    print("      BACKEND ENDPOINT INTEGRATION TEST      ")
    print("=============================================\n")
    
    success = True
    
    # 1. Health check
    try:
        res = requests.get(f"{BASE_URL}/")
        print(f"[TEST 1] Health Check: {'PASS' if res.status_code == 200 and 'running' in res.text else 'FAIL'} (Status: {res.status_code})")
    except Exception as e:
        print("[TEST 1] Health Check: FAIL (Error connecting)", e)
        sys.exit(1)
        
    # 2. Login as seeded Admin
    admin_token = None
    try:
        login_data = {
            "email": "admin@hs-fulda.de",
            "password": "AdminPass123!"
        }
        res = requests.post(f"{BASE_URL}/api/users/login", json=login_data)
        if res.status_code == 200:
            admin_token = res.json().get("token")
            print("[TEST 2] Admin Login: PASS")
        else:
            print(f"[TEST 2] Admin Login: FAIL (Status: {res.status_code}, Msg: {res.text})")
            success = False
    except Exception as e:
        print("[TEST 2] Admin Login: FAIL (Error)", e)
        success = False

    # 3. Fetch admin dashboard counts
    headers = {"Authorization": f"Bearer {admin_token}"} if admin_token else {}
    try:
        res = requests.get(f"{BASE_URL}/api/admin/dashboard-counts", headers=headers)
        if res.status_code == 200:
            counts = res.json()
            print(f"[TEST 3] Admin Dashboard Counts: PASS (Awaiting: {counts.get('postsAwaitingApproval')}, Scam users: {counts.get('usersReportedAsScam')}, Scam posts: {counts.get('postsMarkedAsScam')})")
        else:
            print(f"[TEST 3] Admin Dashboard Counts: FAIL (Status: {res.status_code})")
            success = False
    except Exception as e:
        print("[TEST 3] Admin Dashboard Counts: FAIL (Error)", e)
        success = False

    # 4. User Signup
    try:
        signup_data = {
            "full_name": "Test Student",
            "email": "test_student@hs-fulda.de",
            "password": "Password123!"
        }
        res = requests.post(f"{BASE_URL}/api/users/signup", json=signup_data)
        if res.status_code == 201:
            print("[TEST 4] Student Signup: PASS")
        else:
            print(f"[TEST 4] Student Signup: FAIL (Status: {res.status_code})")
            success = False
    except Exception as e:
        print("[TEST 4] Student Signup: FAIL (Error)", e)
        success = False

    # 5. User Login
    student_token = None
    try:
        login_data = {
            "email": "test_student@hs-fulda.de",
            "password": "Password123!"
        }
        res = requests.post(f"{BASE_URL}/api/users/login", json=login_data)
        if res.status_code == 200:
            student_token = res.json().get("token")
            print("[TEST 5] Student Login: PASS")
        else:
            print(f"[TEST 5] Student Login: FAIL (Status: {res.status_code})")
            success = False
    except Exception as e:
        print("[TEST 5] Student Login: FAIL (Error)", e)
        success = False

    # 6. Post Ad (and test ML Moderation Bridge)
    # Let's post a regular textbook listing
    headers_student = {"Authorization": f"Bearer {student_token}"} if student_token else {}
    test_item_id = None
    try:
        ad_data = {
            "title": "Algorithms in Python",
            "description": "Required readings for computer science semester 2.",
            "price": 35.0,
            "category_id": 1,
            "seller_id": 2, # Lillian Becker
            "media_url": "https://gdsd-project-summer-2025.s3.amazonaws.com/samples/book.jpg"
        }
        res = requests.post(f"{BASE_URL}/api/items/add", json=ad_data, headers=headers_student)
        if res.status_code == 201:
            print(f"[TEST 6] Add Advertisement: PASS (Msg: {res.json().get('message')})")
        else:
            print(f"[TEST 6] Add Advertisement: FAIL (Status: {res.status_code}, Msg: {res.text})")
            success = False
    except Exception as e:
        print("[TEST 6] Add Advertisement: FAIL (Error)", e)
        success = False

    # 7. Get pending items (Admin review)
    try:
        res = requests.get(f"{BASE_URL}/api/admin/items/pending", headers=headers)
        if res.status_code == 200:
            pending_items = res.json()
            # Find the ID of our newly added item
            for item in pending_items:
                if item.get("title") == "Algorithms in Python":
                    test_item_id = item.get("item_id")
            print(f"[TEST 7] Get Pending Items: PASS (Found {len(pending_items)} items. New item ID: {test_item_id})")
        else:
            print(f"[TEST 7] Get Pending Items: FAIL (Status: {res.status_code})")
            success = False
    except Exception as e:
        print("[TEST 7] Get Pending Items: FAIL (Error)", e)
        success = False

    # 8. Approve the pending item
    if test_item_id:
        try:
            res = requests.post(f"{BASE_URL}/api/admin/items/approve/{test_item_id}", headers=headers)
            if res.status_code == 200:
                print(f"[TEST 8] Approve Item (item_id={test_item_id}): PASS")
            else:
                print(f"[TEST 8] Approve Item: FAIL (Status: {res.status_code})")
                success = False
        except Exception as e:
            print("[TEST 8] Approve Item: FAIL (Error)", e)
            success = False
    else:
        print("[TEST 8] Approve Item: SKIPPED (No item ID)")
        success = False

    # 9. List approved items (Verify public explore list)
    try:
        res = requests.get(f"{BASE_URL}/api/items")
        if res.status_code == 200:
            items = res.json()
            found = any(item.get("item_id") == test_item_id for item in items)
            print(f"[TEST 9] List Public Approved Items: PASS (Approved item in list: {found})")
        else:
            print(f"[TEST 9] List Public Approved Items: FAIL (Status: {res.status_code})")
            success = False
    except Exception as e:
        print("[TEST 9] List Public Approved Items: FAIL (Error)", e)
        success = False

    # 10. Buy the approved item (Student coordinates meetup)
    if test_item_id:
        try:
            buy_data = {
                "payment_method": "Offline Cash",
                "message": "Let's meet tomorrow at 12:00 in the campus library."
            }
            res = requests.post(f"{BASE_URL}/api/items/buy/{test_item_id}", json=buy_data, headers=headers_student)
            if res.status_code == 200:
                print(f"[TEST 10] Buy Approved Item: PASS (Msg: {res.json().get('message')})")
            else:
                print(f"[TEST 10] Buy Approved Item: FAIL (Status: {res.status_code}, Msg: {res.text})")
                success = False
        except Exception as e:
            print("[TEST 10] Buy Approved Item: FAIL (Error)", e)
            success = False
    else:
        print("[TEST 10] Buy Approved Item: SKIPPED")
        success = False

    print("\n=============================================")
    if success:
        print("     ALL ENDPOINT INTEGRATION TESTS PASS!     ")
    else:
        print("          SOME INTEGRATION TESTS FAILED.      ")
    print("=============================================\n")
    
    if success:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
