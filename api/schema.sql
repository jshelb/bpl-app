-- Define Teams table
CREATE TABLE Teams (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    elo INTEGER NOT NULL,
    wins INTEGER NOT NULL,
    losses INTEGER NOT NULL,
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

-- Define Schedule table
CREATE TABLE Schedule (
    id INTEGER PRIMARY KEY,
    week INTEGER NOT NULL,
    group_number INTEGER NOT NULL,
    FOREIGN KEY (group_number) REFERENCES Groups(group_number)
);

-- Define Groups table
CREATE TABLE Groups (
    id INTEGER PRIMARY KEY,
    group_number INTEGER NOT NULL,
    team_name TEXT NOT NULL,
    FOREIGN KEY (team_name) REFERENCES Teams(name),
    FOREIGN KEY (group_number) REFERENCES Schedule(group_number)
);
