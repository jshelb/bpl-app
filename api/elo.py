# Constants
EXP_RATE = 400  # You may adjust this based on your requirements
MAX_ELO = 2150  # Adjust as needed
K = 40
K_high = 20
DEFAULT_ELO = 1500

# Function to get Elo rating from the database
def get_elo_from_db(team_name, cursor):
    cursor.execute("SELECT elo FROM Teams WHERE name = ?", (team_name,))
    result = cursor.fetchone()
    return result[0] if result else DEFAULT_ELO

# Function to update Elo rating in the database
def update_elo_in_db(team_name, new_elo, cursor):
    cursor.execute("UPDATE Teams SET elo = ? WHERE name = ?", (new_elo, team_name))

# Function to calculate expected result
def calculate_expected(rating1, rating2):
    return 1 / (1 + 10**((rating2 - rating1) / EXP_RATE))

# Function to compute coefficient for cup differential
def calculate_C(cups1, cups2):
    diff = abs(cups1 - cups2)
    return 1 if diff == 1 else (11 + diff) / 8

# Function to update Elo ratings in the database based on game outcome
def update_elo_in_db_from_game(team1, team2, cups1, cups2, cursor):
    expected1 = calculate_expected(get_elo_from_db(team1, cursor), get_elo_from_db(team2, cursor))
    expected2 = calculate_expected(get_elo_from_db(team2, cursor), get_elo_from_db(team1, cursor))
    C = calculate_C(cups1, cups2)
    result1 = 1 if cups1 > cups2 else 0
    result2 = 1 if cups2 > cups1 else 0

    K_t1 = K if get_elo_from_db(team1, cursor) <= MAX_ELO else K_high
    K_t2 = K if get_elo_from_db(team2, cursor) <= MAX_ELO else K_high

    # Update Elo ratings in the database
    new_elo_team1 = get_elo_from_db(team1, cursor) + K_t1 * C * (result1 - expected1)
    new_elo_team2 = get_elo_from_db(team2, cursor) + K_t2 * C * (result2 - expected2)

    update_elo_in_db(team1, new_elo_team1, cursor)
    update_elo_in_db(team2, new_elo_team2, cursor)
