## 🔐 Connect to Ubuntu EC2 Instance via SSH  
Follow these steps to securely connect to your Ubuntu-based AWS EC2 instance via SSH.

## ✅ Prerequisites
- 🟠 EC2 instance running **Ubuntu**
- 🔑 SSH key pair (.pem file) from AWS
- 🌐 Public IP or Public DNS of the instance
- 💻 Terminal (Linux/macOS) or SSH client (Windows: e.g., Git Bash / PuTTY)

## 🛠️ SSH Connection Steps
1. Set correct permissions for the key file:
>> chmod 400 path/to/your-key.pem

2. Connect to the instance using SSH:
>> ssh -i path/to/your-key.pem ubuntu@<your-ec2-public-ip>

**Example:**
>> ssh -i ~/Downloads/my-key.pem ubuntu@18.222.123.45

3. Verify the fingerprint (only the first time):
- Type **yes** when prompted to confirm the server identity.

4. Access granted:
- You will now have shell access to the Ubuntu EC2 instance! 🎉

## DB Details
1. DB instance identifier- team4-db
2. Master username- admin
3. Master Password- Gdsdteam4_123
4. DB name- team4appdb
