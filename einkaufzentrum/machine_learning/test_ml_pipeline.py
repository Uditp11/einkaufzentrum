"""
Comprehensive ML Pipeline Verification Script
Tests:
  1. Model loads and predicts correctly on Fashion MNIST test split
  2. classify_image.py subprocess works with local images from the dataset
  3. Backend /api/items/add endpoint triggers AI moderation for spam images
"""
import os
import sys
import json
import subprocess
import threading
import time
import requests

# ── Paths ──
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(SCRIPT_DIR, "..", "backend")
ML_DIR = os.path.join(SCRIPT_DIR)
# Windows venvs keep python in Scripts, Linux and macOS in bin
ML_PYTHON = os.path.join(ML_DIR, "venv", "Scripts", "python.exe") if os.name == "nt" else os.path.join(ML_DIR, "venv", "bin", "python")
CLASSIFY_SCRIPT = os.path.join(ML_DIR, "classify_image.py")
DATASET_DIR = os.path.join(ML_DIR, "fashion_mnist_dataset", "fashion_mnist")
MODEL_PATH = os.path.join(ML_DIR, "spam_detection_model.keras")

results = []

def log(test_name, passed, detail=""):
    status = "PASS" if passed else "FAIL"
    results.append((test_name, passed, detail))
    print(f"  [{status}] {test_name}: {detail}")


# =============================================
#  TEST 1: Model file exists
# =============================================
print("\n" + "="*60)
print("  ML PIPELINE VERIFICATION")
print("="*60)

print("\n-- Test 1: Model & environment checks --")
log("Model file exists", os.path.exists(MODEL_PATH), MODEL_PATH)
log("ML venv python exists", os.path.exists(ML_PYTHON), ML_PYTHON)
log("classify_image.py exists", os.path.exists(CLASSIFY_SCRIPT), CLASSIFY_SCRIPT)
log("Dataset directory exists", os.path.exists(DATASET_DIR), DATASET_DIR)


# =============================================
#  TEST 2: classify_image.py with APPROPRIATE images (labels 0-7)
# =============================================
print("\n-- Test 2: classify_image.py on APPROPRIATE images (labels 0-7) --")

# Find sample images for labels 0 through 7
appropriate_files = []
for label in range(0, 8):
    prefix = f"{label}-"
    for f in os.listdir(DATASET_DIR):
        if f.startswith(prefix) and f.endswith(".png"):
            appropriate_files.append((label, os.path.join(DATASET_DIR, f)))
            break

for label, img_path in appropriate_files:
    try:
        result = subprocess.run(
            [ML_PYTHON, CLASSIFY_SCRIPT, img_path],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            lines = result.stdout.strip().split("\n")
            pred = json.loads(lines[-1])
            is_spam = pred.get("is_spam", None)
            score = pred.get("score", -1)
            passed = pred.get("success", False) and is_spam == False
            log(
                f"Label {label} image -> Appropriate",
                passed,
                f"score={score:.4f}, is_spam={is_spam}"
            )
        else:
            log(f"Label {label} image -> Appropriate", False, f"returncode={result.returncode}, stdout={result.stdout[-300:]}, stderr={result.stderr[-200:]}")
    except Exception as e:
        log(f"Label {label} image -> Appropriate", False, str(e))


# =============================================
#  TEST 3: classify_image.py with SPAM images (labels 8, 9)
# =============================================
print("\n-- Test 3: classify_image.py on SPAM images (labels 8, 9) --")

spam_files = []
for label in [8, 9]:
    prefix = f"{label}-"
    for f in os.listdir(DATASET_DIR):
        if f.startswith(prefix) and f.endswith(".png"):
            spam_files.append((label, os.path.join(DATASET_DIR, f)))
            break

for label, img_path in spam_files:
    try:
        result = subprocess.run(
            [ML_PYTHON, CLASSIFY_SCRIPT, img_path],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            lines = result.stdout.strip().split("\n")
            pred = json.loads(lines[-1])
            is_spam = pred.get("is_spam", None)
            score = pred.get("score", -1)
            passed = pred.get("success", False) and is_spam == True
            log(
                f"Label {label} image -> Spam",
                passed,
                f"score={score:.4f}, is_spam={is_spam}"
            )
        else:
            log(f"Label {label} image -> Spam", False, f"returncode={result.returncode}, stdout={result.stdout[-300:]}, stderr={result.stderr[-200:]}")
    except Exception as e:
        log(f"Label {label} image -> Spam", False, str(e))


# =============================================
#  TEST 4: Backend integration – posting ad with spam image triggers AI flag
# =============================================
print("\n-- Test 4: Backend integration - spam image triggers AI report --")

# Start backend in a thread
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from app import app as flask_app

with flask_app.app_context():
    from extensions import db as flask_db
    flask_db.create_all()

server_thread = threading.Thread(
    target=lambda: flask_app.run(host="127.0.0.1", port=5066, use_reloader=False),
    daemon=True
)
server_thread.start()
time.sleep(2)

BASE = "http://127.0.0.1:5066"

try:
    # Login as admin to get baseline counts
    login_res = requests.post(f"{BASE}/api/users/login", json={
        "email": "admin@hs-fulda.de",
        "password": "AdminPass123!"
    })
    token = login_res.json().get("token")
    headers = {"Authorization": f"Bearer {token}"}

    # Get baseline report count
    counts_before = requests.get(f"{BASE}/api/admin/dashboard-counts", headers=headers).json()
    scam_before = counts_before.get("postsMarkedAsScam", 0)

    # Pick a spam image (label 9 = Ankle Boot)
    spam_img_path = None
    for f in os.listdir(DATASET_DIR):
        if f.startswith("9-") and f.endswith(".png"):
            spam_img_path = os.path.join(DATASET_DIR, f)
            break

    # Post an ad with the spam image as media_url (local file path)
    post_res = requests.post(f"{BASE}/api/items/add", json={
        "title": "ML Test - Spam Image Ad",
        "description": "Testing AI moderation with a label-9 ankle boot image",
        "price": 10.0,
        "category_id": 1,
        "seller_id": 2,
        "media_url": spam_img_path
    })
    post_data = post_res.json()
    flagged = post_data.get("flagged", False)
    log(
        "Spam image ad flagged by AI",
        flagged,
        f"response: {post_data.get('message', '')}"
    )

    # Verify report count increased
    counts_after = requests.get(f"{BASE}/api/admin/dashboard-counts", headers=headers).json()
    scam_after = counts_after.get("postsMarkedAsScam", 0)
    log(
        "Scam posts count increased in admin dashboard",
        scam_after > scam_before,
        f"before={scam_before}, after={scam_after}"
    )

    # Now post an ad with an APPROPRIATE image (label 0 = T-shirt)
    appropriate_img_path = None
    for f in os.listdir(DATASET_DIR):
        if f.startswith("0-") and f.endswith(".png"):
            appropriate_img_path = os.path.join(DATASET_DIR, f)
            break

    post_res2 = requests.post(f"{BASE}/api/items/add", json={
        "title": "ML Test - Clean Image Ad",
        "description": "Testing AI moderation with a label-0 t-shirt image",
        "price": 15.0,
        "category_id": 1,
        "seller_id": 2,
        "media_url": appropriate_img_path
    })
    post_data2 = post_res2.json()
    not_flagged = not post_data2.get("flagged", False)
    log(
        "Clean image ad NOT flagged by AI",
        not_flagged,
        f"response: {post_data2.get('message', '')}"
    )

except Exception as e:
    log("Backend integration test", False, str(e))


# =============================================
#  SUMMARY
# =============================================
print("\n" + "="*60)
total = len(results)
passed = sum(1 for _, p, _ in results if p)
failed = total - passed
print(f"  RESULTS: {passed}/{total} passed, {failed} failed")
if failed == 0:
    print("  [OK] ALL ML PIPELINE TESTS PASS!")
else:
    print("  [!!] SOME TESTS FAILED:")
    for name, p, detail in results:
        if not p:
            print(f"    - {name}: {detail}")
print("="*60 + "\n")
sys.exit(1 if failed else 0)
