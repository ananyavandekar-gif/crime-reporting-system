from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_db_connection

app = Flask(__name__)
CORS(app)


# =========================================================
# MOCK DATA
# =========================================================

users = [
    {
        "id": 1,
        "name": "Admin User",
        "email": "admin@crime.com",
        "password": "admin123",
        "role": "Admin"
    },
    {
        "id": 2,
        "name": "Police Officer",
        "email": "police@crime.com",
        "password": "police123",
        "role": "Police Officer"
    },
    {
        "id": 3,
        "name": "Citizen User",
        "email": "citizen@crime.com",
        "password": "citizen123",
        "role": "Citizen"
    }
]


crime_types = [
    {
        "id": 1,
        "name": "Theft"
    },
    {
        "id": 2,
        "name": "Assault"
    },
    {
        "id": 3,
        "name": "Fraud"
    },
    {
        "id": 4,
        "name": "Cybercrime"
    },
    {
        "id": 5,
        "name": "Burglary"
    },
    {
        "id": 6,
        "name": "Missing Person"
    }
]


locations = [
    {
        "id": 1,
        "name": "Pune"
    },
    {
        "id": 2,
        "name": "Mumbai"
    },
    {
        "id": 3,
        "name": "Nashik"
    },
    {
        "id": 4,
        "name": "Nagpur"
    }
]


crime_reports = [
    {
        "id": 1,
        "user_id": 3,
        "crime_type": "Theft",
        "location": "Pune",
        "date": "2026-09-25",
        "description": "Mobile phone reported stolen.",
        "status": "Pending"
    },
    {
        "id": 2,
        "user_id": 3,
        "crime_type": "Cybercrime",
        "location": "Mumbai",
        "date": "2026-09-26",
        "description": "Suspicious online transaction reported.",
        "status": "Under Investigation"
    },
    {
        "id": 3,
        "user_id": 3,
        "crime_type": "Burglary",
        "location": "Pune",
        "date": "2026-09-27",
        "description": "House burglary reported.",
        "status": "Resolved"
    }
]


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():
    return jsonify({
        "message": "Crime Reporting API is running"
    })


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "Backend is working"
    })


# =========================================================
# DATABASE TEST
# =========================================================

@app.route("/test-db")
def test_database():
    try:
        connection = get_db_connection()
        connection.close()

        return jsonify({
            "message": "Database connection successful"
        })

    except Exception as e:
        return jsonify({
            "message": "Database connection failed",
            "error": str(e)
        }), 500


# =========================================================
# LOGIN
# =========================================================

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    for user in users:

        if user["email"] == email and user["password"] == password:

            return jsonify({
                "message": "Login successful",
                "user": {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "role": user["role"]
                }
            })

    return jsonify({
        "error": "Invalid email or password"
    }), 401


# =========================================================
# USERS
# =========================================================

@app.route("/api/users", methods=["GET"])
def get_users():

    safe_users = []

    for user in users:
        safe_users.append({
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        })

    return jsonify({
        "count": len(safe_users),
        "users": safe_users
    })


# =========================================================
# CRIME TYPES
# =========================================================

@app.route("/api/crime-types", methods=["GET"])
def get_crime_types():

    return jsonify({
        "count": len(crime_types),
        "crime_types": crime_types
    })


# =========================================================
# LOCATIONS
# =========================================================

@app.route("/api/locations", methods=["GET"])
def get_locations():

    return jsonify({
        "count": len(locations),
        "locations": locations
    })


# =========================================================
# GET ALL CRIME REPORTS
# =========================================================

@app.route("/api/reports", methods=["GET"])
def get_reports():

    return jsonify({
        "count": len(crime_reports),
        "reports": crime_reports
    })


# =========================================================
# GET ONE CRIME REPORT
# =========================================================

@app.route("/api/reports/<int:report_id>", methods=["GET"])
def get_report(report_id):

    for report in crime_reports:

        if report["id"] == report_id:

            return jsonify({
                "report": report
            })

    return jsonify({
        "error": "Report not found"
    }), 404


# =========================================================
# CREATE CRIME REPORT
# =========================================================

@app.route("/api/reports", methods=["POST"])
def create_report():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    required_fields = [
        "user_id",
        "crime_type",
        "location",
        "date",
        "description"
    ]

    for field in required_fields:

        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    new_report = {
        "id": len(crime_reports) + 1,
        "user_id": data.get("user_id"),
        "crime_type": data.get("crime_type"),
        "location": data.get("location"),
        "date": data.get("date"),
        "description": data.get("description"),
        "status": "Pending"
    }

    crime_reports.append(new_report)

    return jsonify({
        "message": "Crime report created successfully",
        "report": new_report
    }), 201


# =========================================================
# UPDATE REPORT STATUS
# =========================================================

@app.route("/api/reports/<int:report_id>/status", methods=["PUT"])
def update_report_status(report_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    new_status = data.get("status")

    allowed_statuses = [
        "Pending",
        "Under Investigation",
        "Resolved",
        "Rejected"
    ]

    if new_status not in allowed_statuses:

        return jsonify({
            "error": "Invalid status",
            "allowed_statuses": allowed_statuses
        }), 400

    for report in crime_reports:

        if report["id"] == report_id:

            report["status"] = new_status

            return jsonify({
                "message": "Report status updated successfully",
                "report": report
            })

    return jsonify({
        "error": "Report not found"
    }), 404


# =========================================================
# DELETE REPORT
# =========================================================

@app.route("/api/reports/<int:report_id>", methods=["DELETE"])
def delete_report(report_id):

    for report in crime_reports:

        if report["id"] == report_id:

            crime_reports.remove(report)

            return jsonify({
                "message": "Report deleted successfully"
            })

    return jsonify({
        "error": "Report not found"
    }), 404


# =========================================================
# DASHBOARD STATISTICS
# =========================================================

@app.route("/api/dashboard", methods=["GET"])
def dashboard():

    total = len(crime_reports)

    pending = 0
    investigation = 0
    resolved = 0
    rejected = 0

    for report in crime_reports:

        if report["status"] == "Pending":
            pending += 1

        elif report["status"] == "Under Investigation":
            investigation += 1

        elif report["status"] == "Resolved":
            resolved += 1

        elif report["status"] == "Rejected":
            rejected += 1

    return jsonify({
        "total_reports": total,
        "pending": pending,
        "under_investigation": investigation,
        "resolved": resolved,
        "rejected": rejected
    })


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )