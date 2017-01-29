from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash, jsonify
from pocket import Pocket, PocketException
import requests
import pickle
import controllers

from flask_cors import CORS

DEBUG = True
app = Flask(__name__, template_folder="../templates")
#needed for cross request from same domain
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config.from_object(__name__)

#Create data structures for faster fetching later
#These are global so they stay while going to different parts of website, no need for database (yet?)

all_links, tag_dict = controllers.data_from_pickle()

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
    if request.method == 'POST':
        search_term = request.form['search_input']
        return redirect(url_for('search', q=search_term))

    return render_template('index.html', tags=list(tag_dict.keys()))

@app.route('/tags', methods=['POST', 'GET'])
def json_tags():
    return jsonify(tags=list(tag_dict.keys()))

@app.route('/search', methods=['POST', 'GET'])
def search():
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

    return jsonify(results=list(results))
    #return render_template('posts.html', results=results, tags=tags, search_term=search_term)

if __name__ == '__main__':
    app.run()