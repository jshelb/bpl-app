-- Define Teams table
CREATE TABLE Teams (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    points INTEGER NOT NULL,
    elo INTEGER NOT NULL,
    wins INTEGER NOT NULL,
    losses INTEGER NOT NULL,
    ot_losses INTEGER NOT NULL,
    cupDifferential INTEGER NOT NULL
);

-- Define Games table
CREATE TABLE Games (
    id INTEGER PRIMARY KEY,
    team1 TEXT NOT NULL,
    team2 TEXT NOT NULL,
    cups1 INTEGER NOT NULL,
    cups2 INTEGER NOT NULL,
    FOREIGN KEY (team1) REFERENCES Teams(name),
    FOREIGN KEY (team2) REFERENCES Teams(name)
);
