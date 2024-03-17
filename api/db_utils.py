import os
import sqlite3

from elo import DEFAULT_ELO, update_elo_in_db_from_game

DB_PATH = 'api/data/bpl_data.db'

# Function to initialize the database with the defined schema
def init_db():
    connection = sqlite3.connect(DB_PATH)
    cursor = connection.cursor()

    # Read and execute the schema.sql file
    with open('api/schema.sql', 'r') as schema_file:
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

        # Check if there are existing teams, and remove them
        # TODO: if old season data exists in other tables, we must delete also
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
                                WHEN ? > ? THEN 3
                                WHEN ? >= 10 AND ? >= 10 AND ? <= ? THEN 1
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
        # Get a database connection
        connection, cursor = get_db_connection()

        # Execute a query to fetch all games data
        # TODO: limit games returned from this to 10 instead of doing it below
        cursor.execute("SELECT * FROM Games")
        games_data = cursor.fetchall()
        connection.close()

        # Convert the result to a JSON format and return
        games_json = [dict(row) for row in games_data]

        # return 10 most recent games in db
        return games_json[::-1] if len(games_json) < 10 else games_json[:-10:-1]

    except Exception as e:
        # Handle any exceptions, such as database connection errors
        print(f"Error fetching games: {e}")
        return []