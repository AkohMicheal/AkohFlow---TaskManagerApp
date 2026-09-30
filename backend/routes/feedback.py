from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import db, Feedback

feedback_bp = Blueprint('feedback', __name__, url_prefix='/api/feedback')

@feedback_bp.route('', methods=['POST'])
def submit_feedback():
    data = request.get_json(silent=True) or {}
    text = data.get('feedback_text', '').strip()

    if not text:
        return jsonify({'error': 'Feedback cannot be empty.'}), 400

    # Optional JWT user identification
    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity:
            user_id = int(identity)
    except Exception:
        pass

    feedback_entry = Feedback(user_id=user_id, feedback_text=text)
    try:
        db.session.add(feedback_entry)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to submit feedback.'}), 500

    return jsonify({
        'message': 'Thank you for your feedback!',
        'feedback': feedback_entry.to_dict()
    }), 201
