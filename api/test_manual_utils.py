import sqlite3
from db_utils import DB_PATH, delete_game, set_cup_diff

def insert_team():
    """
    Test function for inserting a test team into the database.

    This function connects to the SQLite database, inserts a test team with predefined data,
    and prints a success message if the insertion is successful. It is designed as a lightweight
    test for the database insertion functionality.

    Note: Adjust the test team data in the 'insert_team_data' variable as needed.
    """
    try:
        # Get a database connection
        connection = sqlite3.connect(DB_PATH)
        cursor = connection.cursor()

        # Insert the test team into the database
        insert_team_query = """
            INSERT INTO Teams (name, points, elo, wins, losses, ot_losses, cupDifferential) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        test_team_data = ("test/team", 100, 1500, 0, 0, 0, 0)
        cursor.execute(insert_team_query, test_team_data)

        # Commit changes and close the database connection
        connection.commit()
        connection.close()

        print("Team inserted successfully")

    except sqlite3.Error as e:
        # Log the error or take appropriate action
        print(f"Database query error: {e}")


def test_delete_game():
    delete_game(1)
    return

def test_set_cup_diff():
    set_cup_diff(teamName="Halden/Shelby", newDiff=23)



if __name__ == "__main__":
    test_set_cup_diff()
