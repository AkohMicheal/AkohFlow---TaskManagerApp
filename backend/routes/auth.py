from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re
from models import db, User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
VALID_AVATARS = ['dog', 'cat', 'sheep', 'panda', 'fox', 'rabbit', 'bear', 'lion']

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    avatar = data.get('avatar', 'dog').lower()

    if avatar not in VALID_AVATARS:
        avatar = 'dog'

    if not username or len(username) < 3:
        return jsonify({'error': 'Username must be at least 3 characters long.'}), 400

    if not re.match(r'^[a-zA-Z0-9_.-]+$', username):
        return jsonify({'error': 'Username can only contain letters, numbers, underscores, and dashes.'}), 400

    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({'error': 'Please provide a valid email address.'}), 400

    if not password or len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long.'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'That username is already taken. Please choose another.'}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with this email already exists.'}), 409

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        avatar=avatar
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Database error while registering user.'}), 500

    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({
        'message': 'Welcome to FocusPaws!',
        'token': access_token,
        'user': new_user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    identifier = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({'error': 'Email/Username and password are required.'}), 400

    # Allow login with either email or username
    user = User.query.filter(
        (User.email == identifier) | (User.username.ilike(identifier))
    ).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email/username or password.'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Login successful!',
        'token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify({'error': 'User not found.'}), 404
    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify({'error': 'User not found.'}), 404

    data = request.get_json(silent=True) or {}
    if 'avatar' in data:
        avatar = data.get('avatar', '').lower()
        if avatar in VALID_AVATARS:
            user.avatar = avatar

    if 'username' in data:
        new_username = data.get('username', '').strip()
        if len(new_username) >= 3 and re.match(r'^[a-zA-Z0-9_.-]+$', new_username):
            existing = User.query.filter_by(username=new_username).first()
            if existing and existing.id != user.id:
                return jsonify({'error': 'Username already taken.'}), 409
            user.username = new_username

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile.'}), 500

    return jsonify({
        'message': 'Profile updated successfully!',
        'user': user.to_dict()
    }), 200
