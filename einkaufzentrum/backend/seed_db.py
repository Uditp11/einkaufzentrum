import os
import sys
from datetime import datetime

# Adjust Python path to include current folder
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import app
from extensions import db
from models import Category, User, Item, Report

def seed_database():
    print("Resetting database...")
    db.drop_all()
    db.create_all()
    print("Database tables created successfully.")

    # 1. Seed Categories
    print("Seeding categories...")
    categories = [
        Category(name="Books", description="Textbooks, study materials, and notebooks"),
        Category(name="Bikes", description="Bicycles, accessories, and locks"),
        Category(name="Electronics", description="Computers, phones, calculators, and chargers")
    ]
    for category in categories:
        db.session.add(category)
    db.session.commit()
    print(f"Seeded {len(categories)} categories.")

    # 2. Seed Users
    print("Seeding users...")
    admin = User(
        full_name="System Administrator",
        email="admin@hs-fulda.de",
        status="Active",
        role="Admin",
        joined_date=datetime.utcnow()
    )
    admin.set_password("AdminPass123!")

    lillian = User(
        full_name="Lillian Becker",
        email="lillian@hs-fulda.de",
        status="Active",
        role="User",
        joined_date=datetime.utcnow()
    )
    lillian.set_password("Password123!")

    yash = User(
        full_name="Yash Patel",
        email="yash@hs-fulda.de",
        status="Active",
        role="User",
        joined_date=datetime.utcnow()
    )
    yash.set_password("Password123!")

    lukas = User(
        full_name="Lukas Brandt",
        email="lukas@hs-fulda.de",
        status="Active",
        role="User",
        joined_date=datetime.utcnow()
    )
    lukas.set_password("Password123!")

    scammer = User(
        full_name="Suspect Seller",
        email="scammer@hs-fulda.de",
        status="Active",
        role="User",
        joined_date=datetime.utcnow()
    )
    scammer.set_password("Password123!")

    db.session.add_all([admin, lillian, yash, lukas, scammer])
    db.session.commit()
    print("Seeded users. Credentials:")
    print("  Admin: admin@hs-fulda.de / AdminPass123!")
    print("  Lillian: lillian@hs-fulda.de / Password123!")
    print("  Yash: yash@hs-fulda.de / Password123!")
    print("  Lukas: lukas@hs-fulda.de / Password123!")
    print("  Scammer: scammer@hs-fulda.de / Password123!")

    # Retrieve inserted IDs/records
    cat_books = Category.query.filter_by(name="Books").first()
    cat_bikes = Category.query.filter_by(name="Bikes").first()
    cat_elec = Category.query.filter_by(name="Electronics").first()

    # 3. Seed Items
    print("Seeding items...")
    items = [
        Item(
            title="Introduction to Algorithms (4th Edition)",
            description="Lillian's Textbook: Used for Global Distributed Software Development, like new condition.",
            price=49.99,
            category_id=cat_books.category_id,
            seller_id=lillian.user_id,
            media_url="https://gdsd-project-summer-2025.s3.amazonaws.com/samples/book.jpg",
            date_posted=datetime.utcnow(),
            status="Approved"
        ),
        Item(
            title="Decathlon Mountain Bike",
            description="Yash's Bike: Perfect for commuting around Fulda. 21 gears, lock included.",
            price=120.00,
            category_id=cat_bikes.category_id,
            seller_id=yash.user_id,
            media_url="https://gdsd-project-summer-2025.s3.amazonaws.com/samples/bike.jpg",
            date_posted=datetime.utcnow(),
            status="Approved"
        ),
        Item(
            title="iPad Pro 11-inch (M1)",
            description="Lukas's Tablet: 128GB Wi-Fi, Space Gray. Includes Apple Pencil 2.",
            price=599.99,
            category_id=cat_elec.category_id,
            seller_id=lukas.user_id,
            media_url="https://gdsd-project-summer-2025.s3.amazonaws.com/samples/ipad.jpg",
            date_posted=datetime.utcnow(),
            status="Approved"
        ),
        # Pending ads
        Item(
            title="Chemistry Lab Notebook",
            description="Lillian's Notebook: Awaiting review. Half-used, 50 blank pages left.",
            price=5.00,
            category_id=cat_books.category_id,
            seller_id=lillian.user_id,
            media_url="https://gdsd-project-summer-2025.s3.amazonaws.com/samples/notebook.jpg",
            date_posted=datetime.utcnow(),
            status="Pending"
        ),
        Item(
            title="City Cruiser Bicycle",
            description="Yash's second bike: Retro style, needs a chain replacement.",
            price=60.00,
            category_id=cat_bikes.category_id,
            seller_id=yash.user_id,
            media_url="https://gdsd-project-summer-2025.s3.amazonaws.com/samples/retro_bike.jpg",
            date_posted=datetime.utcnow(),
            status="Pending"
        ),
        # Spam / Reported ad
        Item(
            title="FREE GIFT CARDS CLICK HERE NO SCAM",
            description="Suspicious listing claiming to give away free shopping vouchers.",
            price=0.00,
            category_id=cat_elec.category_id,
            seller_id=scammer.user_id,
            media_url="https://gdsd-project-summer-2025.s3.amazonaws.com/samples/spam.jpg",
            date_posted=datetime.utcnow(),
            status="Approved"
        )
    ]
    db.session.add_all(items)
    db.session.commit()
    print(f"Seeded {len(items)} items.")

    # Retrieve spam item
    spam_item = Item.query.filter_by(title="FREE GIFT CARDS CLICK HERE NO SCAM").first()

    # 4. Seed Reports
    print("Seeding reports...")
    reports = [
        Report(
            reporter_id=lillian.user_id,
            target_item_id=spam_item.item_id,
            reason="This is a phishing attempt. It redirects to a malware website.",
            status="Pending",
            timestamp=datetime.utcnow()
        ),
        Report(
            reporter_id=yash.user_id,
            target_user_id=scammer.user_id,
            reason="This user is spamming identical listings across multiple categories.",
            status="Pending",
            timestamp=datetime.utcnow()
        )
    ]
    db.session.add_all(reports)
    db.session.commit()
    print(f"Seeded {len(reports)} reports.")
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    with app.app_context():
        seed_database()
