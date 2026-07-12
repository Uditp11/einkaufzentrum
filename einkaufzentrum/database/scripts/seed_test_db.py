import mysql.connector
from faker import Faker
import random
import hashlib

# --- Configuration ---
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'einkaufzentrum_db_password',
    'database': 'einkaufzentrum_test'
}

fake = Faker()
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# --- Reset Tables (Delete + Reset AUTO_INCREMENT) ---
cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
cursor.execute("DELETE FROM MediaReferences;")
cursor.execute("DELETE FROM Items;")
cursor.execute("DELETE FROM Categories;")
cursor.execute("DELETE FROM Users;")
cursor.execute("ALTER TABLE MediaReferences AUTO_INCREMENT = 1;")
cursor.execute("ALTER TABLE Items AUTO_INCREMENT = 1;")
cursor.execute("ALTER TABLE Categories AUTO_INCREMENT = 1;")
cursor.execute("ALTER TABLE Users AUTO_INCREMENT = 1000;")
cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

# --- Insert Users ---
print("Seeding users...")
user_ids = []

plaintext_password = "Password123!"

# Hash the known password using SHA-256
password_hash = hashlib.sha256(plaintext_password.encode()).hexdigest()

for _ in range(5):
    full_name = fake.name()
    email = f"{fake.user_name()}@hs-fulda.de"
    status = 'Active'
	
    cursor.execute("""
        INSERT INTO Users (full_name, email, password_hash, status)
        VALUES (%s, %s, %s, %s)
    """, (full_name, email, password_hash, status))
    user_id = cursor.lastrowid
    user_ids.append(user_id)
	print(f"Inserted user_id={user_id}, email={email}, password={plaintext_password}")


# --- Insert Categories ---
print("Seeding categories...")
categories = [
    ('Books', 'Used textbooks and materials'),
    ('Bikes', 'Second-hand bicycles'),
    ('Electronics', 'Gadgets, laptops, accessories')
]
category_ids = []
for name, desc in categories:
    cursor.execute("INSERT INTO Categories (name, description) VALUES (%s, %s)", (name, desc))
    category_ids.append(cursor.lastrowid)

# --- Insert Items ---
print("Seeding items...")
item_ids = []
media_base_url = "https://s3-bucket.s3.amazonaws.com"

item_keywords = [
    "Bicycle", "Laptop", "Smartphone", "Coffee Table", "Headphones",
    "Gaming Console", "Backpack", "Sneakers", "Wristwatch", "Tablet"
]

description_templates = [
    "Lightly used and in great condition.",
    "Selling due to upgrade – works perfectly!",
    "Ideal for daily use, minor signs of wear.",
    "Barely used, like new!",
    "Great deal – don’t miss out!",
    "Functioning perfectly, selling at a bargain.",
    "Gently used and well-maintained.",
    "Comes with original packaging.",
    "Perfect for students or casual use.",
    "Excellent value for the price."
]

status_options = ['Pending', 'Approved', 'Sold', 'Deleted']

for _ in range(10):
    title = random.choice(item_keywords)
    description = random.choice(description_templates)
    price = round(random.uniform(20, 400), 2)
    category_id = random.choice(category_ids)
    seller_id = random.choice(user_ids)
    image_filename = fake.file_name(extension="jpg")
    media_url = f"{media_base_url}/images/{image_filename}"
    status = random.choice(status_options)

    cursor.execute("""
        INSERT INTO Items (title, description, price, category_id, seller_id, media_url, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (title, description, price, category_id, seller_id, media_url, status))

    item_ids.append(cursor.lastrowid)

# --- Insert Media References ---
print("Seeding media references...")
for item_id in item_ids:
    media_filename = fake.file_name(extension="jpg")
    thumb_filename = "thumb_" + media_filename
    media_url = f"{media_base_url}/images/{media_filename}"
    thumb_url = f"{media_base_url}/thumbnails/{thumb_filename}"

    cursor.execute("""
        INSERT INTO MediaReferences (item_id, media_url, thumbnail_url, media_type)
        VALUES (%s, %s, %s, 'Image')
    """, (item_id, media_url, thumb_url))

# --- Commit and Close ---
conn.commit()
cursor.close()
conn.close()
print("Done seeding and resetting test database.")
