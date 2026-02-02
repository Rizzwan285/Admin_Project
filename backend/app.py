from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import random

app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(
    host="localhost",
    database="visitor_db",
    user="postgres",
    password="password"
)
cur = conn.cursor()

@app.route("/generate-pass", methods=["POST"])
def generate_pass():
    data = request.json
    visitor_name = data.get("visitor_name")

    pass_code = random.randint(1000, 9999)

    cur.execute(
        "INSERT INTO visitor_pass (visitor_name, pass_code) VALUES (%s, %s) RETURNING created_at",
        (visitor_name, pass_code)
    )
    created_at = cur.fetchone()[0]
    conn.commit()

    return jsonify({
        "visitor_name": visitor_name,
        "pass_code": pass_code,
        "created_at": created_at
    })

app.run(debug=True)
