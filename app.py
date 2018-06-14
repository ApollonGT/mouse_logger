from flask import Flask, request, render_template
from random import randint
import sqlite3
import json

app = Flask(__name__)

user_id = 1

@app.route('/', methods=['GET'])
def index():
    global user_id
    user_id = randint(1,10)

    return render_template('./index.html')

@app.route('/api/load', methods=['GET'])
def load():
    conn = sqlite3.connect('mouse_log.db')

    # This enables column access by name: row['column_name']
    conn.row_factory = sqlite3.Row

    cur = conn.cursor()

    rows = cur.execute("SELECT * FROM logs").fetchall()

    cur.close()
    conn.close()

    response =  json.dumps( [dict(x) for x in rows], sort_keys = True, indent = 4, separators = (',', ': '))
    return render_template('load.html', response=response)

@app.route('/api/save', methods=['POST'])
def save():
    global user_id
    conn = sqlite3.connect('mouse_log.db')
    cur = conn.cursor()

    data = request.get_json()
    for info in data:
        query = "INSERT INTO logs VALUES (?,strftime('%s','now'),?,?,?,?,'home',?,?)"
        vals = (user_id, 
                info['winX'], info['winY'], info['x'], info['y'], 
                info['mouseon'], info['agent']
                )
        cur.execute(query, vals)
        conn.commit()

    cur.close()
    conn.close()
    return 'OK'
