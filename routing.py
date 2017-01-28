import os
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash, jsonify
from pocket import Pocket, PocketException
import requests
import pickle

DEBUG = True
app = Flask(__name__)
app.config.from_object(__name__)

#These are global so they stay while going to different parts of website, no need for database (yet?)
tag_dict = None
all_tags = None
all_links = list()

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
    data = pickle.load(open("data/filteredpocket.pickle", "rb"))

    for link in data:
        #extract all unique tags, some have no tags
        link_tags = list(link['tags'].keys())
        tags = tags.union(link_tags)
        items.append(link) #all_links is global

    return tags, items

def build_tags_from_pocket():
    tagdictionary = {}
    for link in all_links:
        link_url = link['resolved_url']
        link_tags = tuple(link['tags'].keys())
        link_time_added = link['time_added']
        link_title = link['resolved_title']
 
        for tag in link['tags'].keys():
            if tagdictionary.get(tag) == None:
                tagdictionary[tag] = set()
             
            tagdictionary[tag].add((link_url, link_title, link_time_added, link_tags))

    return tagdictionary

@app.route('/auth', methods=['POST', 'GET'])
def auth():
    #Used to authenticate with pocket, not working yet
    if request.method == 'POST':
        consumer_key = request.form['consumer_key']
        redirect_uri = request.form['redirect_uri']

        r = requests.post("https://getpocket.com/v3/oauth/request", data={'consumer_key': consumer_key, 'redirect_uri': redirect_uri})
        code = r.text.split("=")[1]

        return redirect("https://getpocket.com/auth/authorize" + "?request_token=" + code + "&" + "redirect_uri=" + "127.0.0.1:5000")

    return render_template('pocket_auth.html')


@app.route('/', methods=['POST', 'GET'])
def index():
    global all_tags
    global all_links

    if all_tags == None:
        all_tags, all_links = data_from_pickle()
        all_tags = sorted(list(all_tags))

    if request.method == 'POST':
        search_term = request.form['search_input']
        return redirect(url_for('search', q=search_term))

    return render_template('index.html', tags=all_tags)

@app.route('/search', methods=['POST', 'GET'])
def search():
    global tag_dict
    if tag_dict == None:
        tag_dict = build_tags_from_pocket()

    if request.method == 'POST':
        search_term = request.form['search_input']
        return redirect(url_for('search', q=search_term))

    search_term = request.args.get('q', '')
    tags = [tag.strip() for tag in search_term.split(",")]
    results = None

    try:
        results = set(tag_dict[tags[0]])

        for tag in tags[1:]:
            results = results.intersection(tag_dict[tag])

    except KeyError:
        return render_template('noresults.html', search_term=search_term)

    if len(results) == 0:
        return render_template('noresults.html', search_term=search_term)

    return jsonify(list(results))
    #return render_template('posts.html', results=results, tags=tags, search_term=search_term)

if __name__ == '__main__':
    app.run()