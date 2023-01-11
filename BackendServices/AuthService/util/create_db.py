import sqlite3
import os

def create_db(database_filename):
    # connect to SQLite
    con = sqlite3.connect(database_filename)

    # Create a Connection
    cur = con.cursor()
    
    # Create users table  in db_web database
    sql = '''CREATE TABLE IF NOT EXISTS "users" (
			"user_id"	INTEGER PRIMARY KEY AUTOINCREMENT,
			"username"	TEXT,
			"password"	TEXT
		)'''
    cur.execute(sql)

    # commit changes
    con.commit()

    # close the connection
    con.close()


if __name__ == '__main__':
		database_filename = os.getenv('DATABASE_FILENAME', 'users_db.db')
		create_db(database_filename)