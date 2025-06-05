-- Switch to test DB
USE team4appdb_test;

-- Create user 'Todtenhoefer' with password
CREATE USER IF NOT EXISTS 'Todtenhoefer'@'%' IDENTIFIED BY 'Gdsdteam4_123';

-- Grant all privileges on test database.
GRANT ALL PRIVILEGES ON team4appdb_test.* TO 'Todtenhoefer'@'%';

-- Apply the changes
FLUSH PRIVILEGES;

-- Creating the tables
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    status ENUM('Active', 'Banned'),
    joined_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

CREATE TABLE Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    price DECIMAL(10,2),
    category_id INT,
    seller_id INT,
    media_url VARCHAR(2083),
    date_posted DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Approved', 'Sold', 'Deleted'),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    FOREIGN KEY (seller_id) REFERENCES Users(user_id)
);

CREATE TABLE MediaReferences (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    media_url VARCHAR(2083),
    thumbnail_url VARCHAR(2083),
    media_type ENUM('Image', 'Video'),
    FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    item_id INT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id),
    FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE ApprovalQueue (
    queue_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    submitted_by INT,
    status ENUM('Pending', 'Approved', 'Rejected'),
    reviewed_by INT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES Items(item_id),
    FOREIGN KEY (submitted_by) REFERENCES Users(user_id),
    FOREIGN KEY (reviewed_by) REFERENCES Users(user_id)
);

CREATE TABLE Reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT,
    target_item_id INT,
    target_user_id INT,
    reason TEXT,
    status ENUM('Pending', 'Reviewed', 'Resolved'),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES Users(user_id),
    FOREIGN KEY (target_item_id) REFERENCES Items(item_id),
    FOREIGN KEY (target_user_id) REFERENCES Users(user_id)
);

CREATE TABLE LoginSessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    login_time DATETIME,
    logout_time DATETIME,
    ip_address VARCHAR(45),
    device_info VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);