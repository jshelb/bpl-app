import sqlite3

# Function to initialize the database with the defined schema
def init_db():
    connection = sqlite3.connect('bpl_data.db')
    cursor = connection.cursor()

    # Read and execute the schema.sql file
    with open('schema.sql', 'r') as schema_file:
        schema_script = schema_file.read()
        cursor.executescript(schema_script)

    # Commit changes and close the connection
    connection.commit()
    connection.close()

# Run the init_db function to initialize the database
if __name__ == '__main__':
    init_db()
