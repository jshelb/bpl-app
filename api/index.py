from flask import Flask, jsonify, request
from api.db_utils import score_game
from db_utils import get_teams, upload_teams

app = Flask(__name__)

# Endpoint to get all teams data
@app.route("/api/teams")
def get_teams_endpoint():
    """
    Retrieves and returns a JSON representation of all teams from the database.
    """
    teams_json = get_teams()
    return jsonify(teams=teams_json)

# Endpoint to handle team upload
@app.route("/api/upload", methods=["POST"])
def upload_teams_endpoint():
    """
    Handles the upload of a list of team names to the database. 
    Removes existing teams and inserts new teams. 
    Expects a POST request with a JSON payload containing a 'teams' key.
    """
    team_info = request.get_json()
    teams = team_info.get('teams', [])

    success = upload_teams(teams)

    if success:
        return jsonify(message="Teams uploaded successfully")
    else:
        return jsonify(error="Internal Server Error"), 500

# Endpoint to score a game
@app.route("/api/score_game", methods=["POST"])
def score_game_endpoint():
    """
    Receives game data (team1, team2, cups1, and cups2) and updates the Games and Teams tables in the database.
    Expects a POST request with a JSON payload containing 'team1', 'team2', 'cups1', and 'cups2' keys.
    """
    game_info = request.get_json()
    team1 = game_info.get('team1', '')
    team2 = game_info.get('team2', '')
    cups1 = game_info.get('cups1', 0)
    cups2 = game_info.get('cups2', 0)

    success = score_game(team1, team2, cups1, cups2)

    if success:
        return jsonify(message="Game scored successfully")
    else:
        return jsonify(error="Internal Server Error"), 500

if __name__ == "__main__":
    app.run(debug=True)
