import json
from flask import Flask, jsonify, request
from scheduler import generate_schedule, schedule_summary
from db_utils import get_teams, upload_teams, score_game, get_recent_games

app = Flask(__name__)

SCHEDULE_FILE = 'api/data/schedule.json'

# Endpoint to get all teams data
@app.route("/api/teams")
def get_teams_endpoint():
    """
    Retrieves and returns a JSON representation of all teams and their data from the database.
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
    # print(game_info)
    team1 = game_info.get('team1', '')
    team2 = game_info.get('team2', '')
    cups1 = game_info.get('cups1', 0)
    cups2 = game_info.get('cups2', 0)

    success = score_game(team1, team2, cups1, cups2)

    if success:
        return jsonify(message="Game scored successfully")
    else:
        return jsonify(error="Internal Server Error"), 500


@app.route("/api/generate_schedule", methods=["POST"])
def generate_schedule_endpoint():
    try:
        data = request.get_json()

        num_wks = int(data.get("num_weeks", 0))
        num_groups = int(data.get("num_groups", 0))

        # Validate input
        if not num_wks or not num_groups:
            return jsonify(error="Invalid input. Please provide num_weeks, and num_groups."), 400

        # Generate schedule
        teams_data = get_teams()
        teams = [team['name'] for team in teams_data]
        result_schedule = generate_schedule(teams, num_wks, num_groups)

        # Prepare response
        response = {"schedule": []}

        # Structure the schedule
        for i, week in enumerate(result_schedule, 1):
            week_data = {"week": i, "groups": []}
            for j, group in enumerate(week, 1):
                group_data = {"group": j, "teams": group}
                week_data["groups"].append(group_data)
            response["schedule"].append(week_data)

        # Generate schedule summary
        summary = schedule_summary(result_schedule)

        return jsonify({ "scheduleData": response, "summary": summary})

    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route("/api/get_schedule", methods=["GET"])
def get_schedule_endpoint():
    try:
        # Read JSON data from file
        with open(SCHEDULE_FILE, 'r') as json_file:
            schedule_data = json.load(json_file)

        return jsonify(schedule_data)

    except Exception as e:
        return jsonify(error=str(e)), 500

# Endpoint to save schedule data
@app.route("/api/save_schedule", methods=["POST"])
def save_schedule():
    try:
        # Get schedule data from the request
        schedule_data = request.get_json()

        print(schedule_data)

        # Write schedule data to the file
        with open(SCHEDULE_FILE, 'w') as json_file:
            json.dump(schedule_data, json_file, indent=2)

        # Return success response
        return jsonify(message="Schedule data saved successfully")

    except Exception as e:
        print(e)
        # Handle errors and return an error response
        return jsonify(error=str(e)), 500

# Endpoint to get all teams data
@app.route("/api/recent_games")
def get_recent_games_endpoint():
    """
    Retrieves and returns a JSON representation of recent games (10 max)
    """
    games_json = get_recent_games()
    return jsonify(games=games_json)

if __name__ == "__main__":
    app.run(debug=True)
