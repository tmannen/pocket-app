import sqlite3

def create_database():
    connection = sqlite3.connect("../../data/userdata.db")

    try:
        connection.execute('''CREATE TABLE LINKS
            (TAGS TEXT,
             ITEM_ID INT,
             TIME_ADDED REAL,
             RESOLVED_URL TEXT,
             GIVEN_TITLE TEXT,
             TIME_FAVORITED REAL,
             EXCERPT TEXT,
             TIME_UPDATED TEXT,
             GIVEN_URL TEXT,
             TIME_READ REAL,
             RESOLVED_TITLE TEXT,
             FAVORITE INT,
             AUTHORS TEXT
             )
             ''')

    except sqlite3.OperationalError as e:
        print(e)

    connection.commit()
    connection.close()

#Create database for fast text searching.
def create_fts(conn):
	conn = sqlite3.connect("../../data/userdata.db")
	query = """CREATE VIRTUAL TABLE LINK_SEARCH USING fts4(
		 TAGS,
         ITEM_ID INT,
         TIME_ADDED,
         RESOLVED_URL,
         GIVEN_TITLE,
         TIME_FAVORITED,
         EXCERPT,
         TIME_UPDATED,
         GIVEN_URL,
         TIME_READ,
         RESOLVED_TITLE,
         FAVORITE,
         AUTHORS);"""
	c = conn.cursor()
	c.execute(query)
	c.execute("INSERT INTO LINK_SEARCH SELECT * FROM LINKS")

	conn.commit()
	conn.close()