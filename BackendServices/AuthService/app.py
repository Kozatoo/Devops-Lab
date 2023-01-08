from flask import Flask, jsonify, request, make_response
import jwt , os, datetime
from functools import wraps


app = Flask(__name__)
app.config["SECRET_KEY"]= os.environ.get("SECRET_KEY") or "secret"
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
    username = request.form['username']
    password = request.form['password']
    
    if not username or not password:
        return make_response("Username or password is empty") , 401
    print(username)
    print(password)
    
    if password != "a":
        return make_response("Wrong password", 401)
    access_token = jwt.encode({
            'username': username,
            'exp' : datetime.datetime.utcnow() + datetime.timedelta(days= 1)
        }, app.config['SECRET_KEY'])
    
    return make_response(jsonify({'token' : access_token.decode('UTF-8')}), 201)
    
if __name__ == '__main__':
    app.run(debug=True)
