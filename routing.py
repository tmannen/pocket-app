from bs4 import BeautifulSoup
import sqlite3
import os
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
from pocket import Pocket, PocketException
import requests

DEBUG = True
all_tags = None
app = Flask(__name__)
app.config.from_object(__name__)

tag_dict = {}
all_links = list()

def pocket_api_call():
    p = Pocket(
        ##tähäm
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

def build_tags():
    soup = BeautifulSoup(open("pocket_data.html", "r"))
    links = soup.find_all('a')
    all_tags = None

    for link in links:
        link_url = link.attrs['href']
        link_tags = link.attrs['tags']
        link_time_added = link.attrs['time_added']
        link_description = link.get_text()

        for tag in link.attrs['tags'].split(","):
            if tag_dict.get(tag) == None:
                tag_dict[tag] = set()
            
            tag_dict[tag].add((link_url, link_description, link_time_added, link_tags))

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

    if all_tags == None:
        all_tags = sorted(list(pocket_api_call()))

    if request.method == 'POST':
        search_term = request.form['search_input']
        return redirect(url_for('search', q=search_term))

    return render_template('index.html', tags=all_tags)

@app.route('/search', methods=['POST', 'GET'])
def search():
    if len(tag_dict) == 0:
        build_tags()

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

    return render_template('posts.html', results=results, tags=tags, search_term=search_term)

if __name__ == '__main__':
    app.run()