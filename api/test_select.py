import sqlite3

def test_select():
    """
    Test function for fetching teams data from the database.

    This function connects to the SQLite database, executes a SELECT query to fetch all teams data,
    and prints the retrieved data. It is designed as a lightweight test for the database fetching functionality.

    Note: Ensure that the 'Teams' table exists and contains data before running this test.
    """
    try:
        # Get a database connection
        connection = sqlite3.connect('bpl_data.db')
        cursor = connection.cursor()

        # Execute a query to fetch all teams data
        cursor.execute("SELECT * FROM Teams")
        teams_data = cursor.fetchall()

        # Print the result
        print("Teams Data:")
        for row in teams_data:
            print(f"ID: {row[0]}, Name: {row[1]}, Points: {row[2]}, Elo: {row[3]}, Wins: {row[4]}, "
                    f"Losses: {row[5]}, OT Losses {row[6]}, Cup Differential: {row[7]}")

        # Close the database connection
        connection.close()

    except sqlite3.Error as e:
        # Log the error or take appropriate action
        print(f"Database query error: {e}")

if __name__ == "__main__":
    test_select()
