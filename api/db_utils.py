import json
import os
import sqlite3

from elo import DEFAULT_ELO, update_elo_in_db_from_game

DB_PATH = 'api/data/bpl_data.db'
DB_SCHEMA = 'api/schema.sql'
SCHEDULE_FILE = 'api/data/schedule.json'

# Function to initialize the database with the defined schema
def init_db():
    connection = sqlite3.connect(DB_PATH)
    cursor = connection.cursor()

    # Read and execute the schema.sql file
    with open(DB_SCHEMA, 'r') as schema_file:
        schema_script = schema_file.read()
        cursor.executescript(schema_script)

    # Commit changes and close the connection
    connection.commit()
    connection.close()

def get_db_connection():
    """
    Note that paths are relative to the base directory when run via "npm dev" or other root
    """
    # Check if the database file exists, if not, initialize the database
    if not os.path.exists(DB_PATH):
        init_db()
    
    # write blank schedule file if one doesn't exist
    if not os.path.exists(SCHEDULE_FILE):
        with open(SCHEDULE_FILE, 'w'):
            pass

    conn = sqlite3.connect(DB_PATH)  # path is relative to base dir
    conn.row_factory = sqlite3.Row
    return conn, conn.cursor()

def get_teams():
    try:
        # Get a database connection
        connection, cursor = get_db_connection()

        # Execute a query to fetch all teams data
        cursor.execute("SELECT * FROM Teams ORDER BY points DESC, cupDifferential DESC")
        teams_data = cursor.fetchall()
        connection.close()

        # Convert the result to a JSON format and return
        teams_json = [dict(row) for row in teams_data]

        return teams_json

    except Exception as e:
        # Handle any exceptions, such as database connection errors
        print(f"Error fetching teams: {e}")
        return []

def upload_teams(teams):
    try:
        # Get a database connection
        connection, cursor = get_db_connection()

        # Validate request data (you might want to add more validation)
        if not isinstance(teams, list):
            print(f"Invalid request data, received {type(teams)}, expected {list[str]}")
            return False

        # write blank schedule file
        with open(SCHEDULE_FILE, 'w'):
            pass
        # delete all teams and games
        cursor.execute("DELETE FROM Teams")
        cursor.execute("DELETE FROM Games")

        # Insert teams into the database
        insert_team_query = """
            INSERT INTO Teams (name, points, elo, wins, losses, ot_losses, cupDifferential) 
            VALUES (?, 0, ?, 0, 0, 0, 0)
        """

        teams_data = [(name, DEFAULT_ELO) for name in teams]
        cursor.executemany(insert_team_query, teams_data)

        # Commit changes and close the database connection
        connection.commit()
        connection.close()

        print("Teams uploaded successfully")
        return True

    except sqlite3.Error as e:
        # Log the error or take appropriate action
        print(f"Database query error: {e}")
        return False


def score_game(team1, team2, cups1, cups2):
    try:
        # Get a database connection
        connection, cursor = get_db_connection()

        # Insert game result into the Games table
        insert_game_query = """
            INSERT INTO Games (team1, team2, cups1, cups2) 
            VALUES (?, ?, ?, ?)
        """
        game_data = (team1, team2, cups1, cups2)
        cursor.execute(insert_game_query, game_data)

        # Update Teams table based on game outcome
        update_teams_query = """
            UPDATE Teams
            SET
                wins = wins + CASE WHEN ? > ? THEN 1 ELSE 0 END,
                losses = losses + CASE WHEN ? <= 10 AND ? <= 10 AND ? < ? THEN 1 ELSE 0 END,
                ot_losses = ot_losses + CASE WHEN ? >= 10 AND ? >= 10 AND ? < ? THEN 1 ELSE 0 END,
                points = points + CASE
                                WHEN ? >= 10 AND ? >= 10 AND ? <= ? THEN 1
                                WHEN ? > ? THEN 3
                                ELSE 0
                            END,
                cupDifferential = cupDifferential + (? - ?)
            WHERE name = ?;
        """

        # update w/l/ot/pts/CD
        team1_data = (cups1, cups2) * 9 + (team1, )
        team2_data = (cups2, cups1) * 9 + (team2, )

        cursor.execute(update_teams_query, team1_data)
        cursor.execute(update_teams_query, team2_data)

        # update elo
        update_elo_in_db_from_game(team1, team2, cups1, cups2, cursor)
        connection.commit()
        connection.close()

        return True

    except sqlite3.Error as e:
        # Log the error or take appropriate action
        print(f"Database query error: {e}")
        return False

def get_recent_games():
    try:
        connection, cursor = get_db_connection()

        # TODO: limit games returned from this to 10 instead of doing it below
        cursor.execute("SELECT * FROM Games")
        games_data = cursor.fetchall()
        connection.close()

        # Convert the result to a JSON format and return
        games_json = [dict(row) for row in games_data]

        # return 10 most recent games in db, reversed so recents first
        return games_json[::-1] if len(games_json) < 10 else games_json[:-10:-1]

    except Exception as e:
        # Handle any exceptions, such as database connection errors
        print(f"Error fetching games: {e}")
        return []

def get_all_games():
    try:
        connection, cursor = get_db_connection()

        # TODO: limit games returned from this to 10 instead of doing it below
        cursor.execute("SELECT * FROM Games")
        games_data = cursor.fetchall()
        connection.close()

        # Convert the result to a JSON format and return
        games_json = [dict(row) for row in games_data]

        return games_json[::-1] # reversed order

    except Exception as e:
        # Handle any exceptions, such as database connection errors
        print(f"Error fetching games: {e}")
        return []

def delete_game(gameID):
    """
        delete a game and update the leaderboard. Does not currently update ELO calculations

        Args:
            gameID [int]: id of the game in the database
    """
    try:
        connection, cursor = get_db_connection()

        # get game result and update team info
        get_game_query = """
            SELECT * FROM Games
            WHERE id = ?
        """
        result = cursor.execute(get_game_query, (gameID,))
        result = cursor.fetchone()
        game = dict(result)

        # Delete the game from db
        delete_game_query = """
            DELETE FROM Games
            WHERE id = ?
        """
        cursor.execute(delete_game_query, (gameID,))

        # TODO: handle elo updates or just leave it
        # also, no error message if game isn't found

        # Now we update the table since the team has been deleted
        update_teams_query = """
            UPDATE Teams
                        SET
                            wins = wins - CASE WHEN ? > ? THEN 1 ELSE 0 END,
                            losses = losses - CASE WHEN ? <= 10 AND ? <= 10 AND ? < ? THEN 1 ELSE 0 END,
                            ot_losses = ot_losses - CASE WHEN ? >= 10 AND ? >= 10 AND ? < ? THEN 1 ELSE 0 END,
                            points = points - CASE
                                            WHEN ? >= 10 AND ? >= 10 AND ? <= ? THEN 1
                                            WHEN ? > ? THEN 3
                                            ELSE 0
                                        END,
                            cupDifferential = cupDifferential - (? - ?)
                        WHERE name = ?;
        """

        # update w/l/ot/pts/CD
        team1_data = (game['cups1'], game['cups2']) * 9 + (game['team1'], )
        team2_data = (game['cups2'], game['cups1']) * 9 + (game['team2'], )

        cursor.execute(update_teams_query, team1_data)
        cursor.execute(update_teams_query, team2_data)

        connection.commit()
        connection.close()
        return True

    except sqlite3.Error as e:
        print(f"Database query error: {e}")
        return False

def recalculate_elo_from_games():
    """
        Intended to be used after adding/changing games as the admin
    """
    ...

def set_cup_diff(teamName: str, newDiff: int):
    try:
        # Get a database connection
        connection, cursor = get_db_connection()

        cursor.execute("SELECT COUNT(*) FROM Teams WHERE name = ?", (teamName,))

        # check if team in DB
        if not cursor.fetchone()[0] > 0:
            print(f"Team '{teamName}' does not exist in the database.")
            connection.close()
            return False


        cursor.execute("UPDATE Teams SET cupDifferential = ? WHERE name = ?", (newDiff, teamName))

        connection.commit()
        connection.close()

        print(f"updated diff to {newDiff}")

        return True

    except sqlite3.Error as e:
        # Log the error or take appropriate action
        print(f"Database query error: {e}")
        return False