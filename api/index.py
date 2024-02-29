from flask import Flask, jsonify
import sqlite3
app = Flask(__name__)

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"


# Function to get a database connection
def get_db_connection():
    """
    Note that paths are relative to the base directory when run via "npm dev" or other root
    """
    conn = sqlite3.connect('api/bpl_data.db')  # path is relative to base dir
    conn.row_factory = sqlite3.Row
    return conn

# Endpoint to get all teams data
@app.route("/api/teams")
def get_teams():
    try:
        # Get a database connection
        connection = get_db_connection()
        cursor = connection.cursor()

        # Execute a query to fetch all teams data
        cursor.execute("SELECT * FROM Teams")
        teams_data = cursor.fetchall()

        # Close the database connection
        connection.close()

        # Convert the result to a JSON format and return
        teams_json = [{'id': row['id'], 'name': row['name'], 'elo': row['elo'], 'wins': row['wins'], 
        'losses': row['losses'], 'cupDifferential': row['cupDifferential']} for row in teams_data]
        return jsonify(teams=teams_json)

    except Exception as e:
        # Handle any exceptions, such as database connection errors
        return jsonify(error=str(e))