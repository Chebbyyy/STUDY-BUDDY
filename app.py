import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import mysql.connector

# ---------------------------
# Load environment variables
# ---------------------------
load_dotenv()

app = Flask(__name__)
CORS(app)

# Hugging Face setup
HF_KEY = os.getenv("HUGGINGFACE_API_KEY")
hf_client = InferenceClient(api_key=HF_KEY)

# Database connection
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",       # change if your XAMPP MySQL user is different
        password="",       # change if you set a password in XAMPP
        database="studybuddy"
    )

# ---------------------------
# ROUTES
# ---------------------------

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    notes = data.get("notes", "")

    if not notes:
        return jsonify({"error": "No notes provided"}), 400

    # Prompt for Hugging Face
    prompt = f"""
    You are a flashcard generator. From these notes, create 3 Q&A flashcards.
    Respond ONLY in valid JSON array format like this:
    [
      {{"front":"What is ...?","back":"It is ..."}},
      {{"front":"Another Q","back":"Answer"}}
    ]

    Notes: {notes}
    """

    try:
        # Call Hugging Face
        response = hf_client.text_generation(
            model="tiiuae/falcon-7b-instruct",  # you can try other models too
            prompt=prompt,
            max_new_tokens=300,
            temperature=0.7
        )

        # Extract JSON safely
        start = response.find("[")
        end = response.rfind("]") + 1
        json_text = response[start:end]

        flashcards = json.loads(json_text)

        # Ensure proper keys
        cleaned = []
        for card in flashcards:
            front = card.get("front") or card.get("question") or "Untitled Question"
            back = card.get("back") or card.get("answer") or "No Answer"
            cleaned.append({"front": front, "back": back})

    except Exception as e:
        print("HF error:", e)
        cleaned = [
            {"front": "Sample Q1", "back": "Sample A1"},
            {"front": "Sample Q2", "back": "Sample A2"},
        ]

    # Save to MySQL
    try:
        db = get_db()
        cursor = db.cursor()
        for card in cleaned:
            cursor.execute(
                "INSERT INTO flashcards (notes, front, back) VALUES (%s, %s, %s)",
                (notes, card["front"], card["back"])
            )
        db.commit()
        cursor.close()
        db.close()
    except Exception as e:
        print("DB error:", e)

    return jsonify({"flashcards": cleaned})


@app.route("/flashcards", methods=["GET"])
def load_flashcards():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, front, back FROM flashcards ORDER BY id DESC")
        rows = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify({"flashcards": rows})
    except Exception as e:
        print("DB error:", e)
        return jsonify({"error": "Could not load flashcards"}), 500


@app.route("/clear", methods=["POST"])
def clear_flashcards():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM flashcards")
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "All flashcards cleared"})
    except Exception as e:
        print("DB error:", e)
        return jsonify({"error": "Could not clear flashcards"}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


# ---------------------------
# START
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)
