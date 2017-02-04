from pocket import Pocket, PocketException
import requests
import pickle

from flask_cors import CORS
code = None

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
    global code
    code = r.json()['code'] #save for use in later api access

    return redirect_uri, code

def access_api():
    consumer_key = open("../../keys.txt", "r").read()
    headers = {'Content-Type': 'application/json', 'X-Accept': 'application/json'}
    content = {'consumer_key': consumer_key, 'code': code}
    r = requests.post("https://getpocket.com/v3/oauth/authorize", json=content, headers=headers)
    return r.json(), consumer_key
