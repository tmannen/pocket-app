from pocket import Pocket, PocketException
import requests
import pickle
import sqlite3

DB_PATH = "../../data/userdata.db"

def pocket_api_call():
    data, consumer_key = access_api()
    access_token = data['access_token']
    username = data['username']

    p = Pocket(
        consumer_key=consumer_key,
        access_token=access_token
    )

    try:
        #retrieve all articles
        links = p.retrieve(detailType='complete')
    except PocketException as e:
        print("Pocket retrieve failed, message: ")
        print(e.message)
        print("\n")

    all_tags = set()

    for key, link in links['list'].items():
        #extract all unique tags, some have no tags
        try:
            link_tags = list(link['tags'].keys())
            all_tags = all_tags.union(link_tags)
            #all_links.append(link)
        except KeyError:
            pass

    return all_tags  

def data_from_pickle():
    tags = set()
    data = pickle.load(open("../../data/filteredpocket.pickle", "rb"))
    tagdictionary = {}
    for idx, link in enumerate(data):
        #extract all unique tags, some have no tags
        link_tags = list(link['tags'].keys())
 
        for tag in link['tags'].keys():
            if tagdictionary.get(tag) == None:
                tagdictionary[tag] = set()
             
            tagdictionary[tag].add(idx)

    return data, tagdictionary

def request_authentication():
    consumer_key = open("../../keys.txt", "r").read()
    redirect_uri = "http://127.0.0.1:5000/authstatus"
    headers = {'Content-Type': 'application/json', 'X-Accept': 'application/json'}
    content = {'consumer_key': consumer_key, 'redirect_uri': redirect_uri}

    r = requests.post("https://getpocket.com/v3/oauth/request", json=content, headers=headers)
    code = r.json()['code']

    return redirect_uri, code

def access_api():
    consumer_key = open("../../keys.txt", "r").read()
    headers = {'Content-Type': 'application/json', 'X-Accept': 'application/json'}
    content = {'consumer_key': consumer_key, 'code': code}
    r = requests.post("https://getpocket.com/v3/oauth/authorize", json=content, headers=headers)
    return r.json(), consumer_key

def query_db(query):
    rows = None
    result = None

    try:
        with sqlite3.connect("../../data/userdata.db") as connection:
            connection.row_factory = sqlite3.Row
            rows = connection.execute(query).fetchall()

        result = [dict(zip(row.keys(), row)) for row in rows] #return values in a list of dictionaries instead of just tuples

    except sqlite3.OperationalError as e:
        print(e)

    return result

def build_tag_query(tags):
    #for tag in tags, AND intersection jne.
    tags = ["\"{}\"".format(tag) for tag in tags]
    q = "SELECT * FROM LINK_SEARCH WHERE tags MATCH '" + " ".join(tags) + "'" #AND doesnt work in multiple tag search, bug?
    return query_db(q)