📚 Study Buddy

An AI-powered flashcard generator built with Flask, MySQL (XAMPP), and Hugging Face.
Paste your notes → Automatically generate flashcards → Save & review them.

🚀 Features

Paste study notes and generate flashcards using AI (Hugging Face).

Save flashcards to a MySQL database.

Flip flashcards to view questions & answers.

Load saved flashcards and clear them anytime.

Upgrade option via IntaSend Payments (optional).

🛠 Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Python (Flask + Flask-CORS)

Database: MySQL (via XAMPP)

AI: Hugging Face Inference API

Payments: IntaSend API

⚙️ Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/study-buddy.git
cd study-buddy

2. Backend Setup (Python + Flask)

Create a virtual environment:

python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows


Install dependencies:

pip install flask flask-cors mysql-connector-python python-dotenv huggingface-hub


Create a .env file inside your backend folder:

HUGGINGFACE_API_KEY=your_hugging_face_key


Run the Flask server:

python app.py


The backend should now run on:
👉 http://127.0.0.1:5000

3. Database Setup (XAMPP)

Open phpMyAdmin (http://localhost/phpmyadmin
).

Run this SQL to create the database:

DROP DATABASE IF EXISTS studybuddy;
CREATE DATABASE studybuddy;

USE studybuddy;

CREATE TABLE flashcards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notes TEXT,
    front VARCHAR(255),
    back VARCHAR(255)
);

4. Frontend Setup

Place your HTML, CSS, and JS files in a folder called frontend/.

Open the index.html file in your browser.

📌 API Endpoints
Method	Endpoint	Description
POST	/generate	Generate flashcards from notes
GET	/flashcards	Load all saved flashcards
POST	/clear	Clear all saved flashcards
GET	/health	Check if backend is running
💳 Payments (Optional)

If you want to enable IntaSend Payments:

Create an account at IntaSend
.

Get your Public and Private Keys from the dashboard.

Add them to .env:

INTASEND_PUBLIC_KEY=your_public_key
INTASEND_SECRET_KEY=your_secret_key
