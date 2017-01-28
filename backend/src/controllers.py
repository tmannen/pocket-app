from pocket import Pocket, PocketException
import requests
import pickle

from flask_cors import CORS

def pocket_api_call():
    p = Pocket(
        consumer_key='',
        access_token=''
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
            all_links.append(link)
        except KeyError:
            pass

    return all_tags  

def data_from_pickle():
    tags = set()
    items = list() #pocket links with metadata and stuff
    data = pickle.load(open("../../data/filteredpocket.pickle", "rb"))
    tagdictionary = {}
    for link in data:
        #extract all unique tags, some have no tags
        link_tags = list(link['tags'].keys())
        tags = tags.union(link_tags)
        items.append(link)
        link_url = link['resolved_url']
        link_tags = tuple(link['tags'].keys())
        link_time_added = link['time_added']
        link_title = link['resolved_title']
 
        for tag in link['tags'].keys():
            if tagdictionary.get(tag) == None:
                tagdictionary[tag] = set()
             
            tagdictionary[tag].add((link_url, link_title, link_time_added, link_tags))

    return items, tagdictionary