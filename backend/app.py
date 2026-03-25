from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from models import db, User

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Allow frontend to call backend
db.init_app(app)

# STEP: Create tables if not exists
with app.app_context():
    db.create_all()

# STEP: GET all users
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

# STEP: POST - Add new user
@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    user = User(name=data['name'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

# STEP: DELETE user by ID
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
