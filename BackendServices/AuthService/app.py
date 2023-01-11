from flask import Flask, jsonify, request, make_response
import jwt , os, datetime
from functools import wraps
import sqlite3
import hmac
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"]= os.environ.get("SECRET_KEY") or "secret"

database_filename = os.environ.get('DATABASE_FILENAME', 'my_db.db')
db_connection = sqlite3.connect(database_filename, check_same_thread=False)

app.config.from_mapping(
    DATABASE_CON=db_connection
)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        # return 401 if token is not passed
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401
  
        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, app.config['SECRET_KEY'])
            print(data)
        except:
            return jsonify({
                'message' : 'Token is invalid !!'
            }), 401
        # returns the current logged in users context to the routes
        return  f(data, *args, **kwargs)
  
    return decorated

def get_user(user_id):
    connection = sqlite3.connect(database_filename)
    item = connection.execute(
        f'SELECT * FROM users WHERE id = {user_id}').fetchone()
    return {
        "user_id": item[0],
        "name": item[1]
    }

def get_user_by_name(user_name):
    connection = sqlite3.connect(database_filename)
    item = connection.execute(
        'SELECT * FROM users WHERE username = ?',(user_name,)).fetchone()
    
    if item == None:
        return False
    return {
        "user_id": item[0],
        "username": item[1],
        "password": item[2]
    }

@app.route("/unprotected")
def unprotected():
    return "unprotected"

@app.route("/protected")
@token_required
def protected(data):
    print(data)
    return "protected"

@app.route("/login", methods=["POST"])
def login():
    request_body = request.get_json()
    username = request_body['username']
    password = request_body['password']
    h_password = hmac.new(app.config["SECRET_KEY"].encode(), password.encode(), 'sha256').hexdigest()    
    if not username or not password:
        return make_response("Username or password is empty") , 401
    
    user_in_db = get_user_by_name(username)
    print("user",user_in_db)
    
    if h_password != user_in_db["password"] :
        return make_response("Wrong password", 401)
    access_token = jwt.encode({
            'username': username,
            'userid': user_in_db["user_id"],
            'exp' : datetime.datetime.utcnow() + datetime.timedelta(days= 1)
        }, app.config['SECRET_KEY'])
    
    return make_response(jsonify({'token' : access_token.decode('UTF-8')}), 201)
    
@app.get('/users')
def get_all_users():
    db_connection = app.config["DATABASE_CON"]
    db_connection.row_factory = sqlite3.Row
    cur = db_connection.cursor()
    cur.execute(
        "SELECT * FROM users"
    )
    data = cur.fetchall()
    return jsonify([
        {
            "user_id": element['user_id'],
            "username": element['username']
        }
        for element in data
    ])

@app.post('/users')
def create_user():
    """
        POST /users JSON
        {
            "username": "test"
            "password": "test"
        }
    """
    request_body = request.get_json()
    username = request_body["username"]
    password = request_body["password"]
    h_password = hmac.new(app.config["SECRET_KEY"].encode(), password.encode(), 'sha256').hexdigest()
    db_connection = app.config["DATABASE_CON"]
    print( get_user_by_name(username) != False ,"aha")
    if get_user_by_name(username) != False :
        return make_response("User already registered"), 401
    cur = db_connection.cursor()
    cur.execute(
        "INSERT INTO users (username, password) VALUES (?,?)",
        (username, h_password)
    )
    db_connection.commit()
    user_id = cur.lastrowid
    db_connection.row_factory = sqlite3.Row
    cur = db_connection.cursor()
    cur.execute(
        "SELECT * FROM users where user_id =?", (user_id, )
    )
    data = cur.fetchone()
    user = dict(data)
    return {
        'user_id': user['user_id'],
        'username': user['username']
    }

@app.delete('/users/<string:user_id>')
def delete_user(user_id):
    db_connection = app.config["DATABASE_CON"]
    cur = db_connection.cursor()
    cur.execute('DELETE FROM users where user_id = ?', (user_id,))
    if cur.rowcount == 0:
        return {
            "message": "User not deleted successfully"
        }
    elif cur.rowcount == 1:
        return {
            "message": "User deleted successfully"
        }
        
if __name__ == '__main__':
    app.run(debug=True)
