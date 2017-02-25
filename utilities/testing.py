import sqlite3
import json
import pickle

def create_database():
    connection = sqlite3.connect("../data/userdata.db")

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
def create_fts():
	conn = sqlite3.connect("../data/userdata.db")
	query = """CREATE VIRTUAL TABLE LINK_SEARCH USING fts4(
         tags,
		 status,
         time_favorited,
         is_index,
         time_read,
         sort_id,
         resolved_url,
         time_added,
         is_article,
         has_video,
         word_count,
         given_title,
         has_image,
         resolved_id,
         time_updated,
         excerpt,
         given_url,
         item_id,
         favorite,
         resolved_title);"""
	c = conn.cursor()
	c.execute(query)

	conn.commit()
	conn.close()

def insert_data():
    connection = sqlite3.connect("../data/userdata.db")
    data = pickle.load(open("../data/filteredpocket.pickle", "rb"))
    cur = connection.cursor()

    for link in data:
        link['tags'] = ','.join([str(x) for x in link['tags'].keys()]) #rest are just as text
        link.pop("authors", None)
        print(link.keys())
        cur.execute("""
         INSERT INTO LINK_SEARCH VALUES (
         :tags,
         :status,
         :time_favorited,
         :is_index,
         :time_read,
         :sort_id,
         :resolved_url,
         :time_added,
         :is_article,
         :has_video,
         :word_count,
         :given_title,
         :has_image,
         :resolved_id,
         :time_updated,
         :excerpt,
         :given_url,
         :item_id,
         :favorite,
         :resolved_title)""", link)

    connection.commit()
    connection.close()

