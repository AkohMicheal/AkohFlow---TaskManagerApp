from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, Task

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')

@tasks_bp.route('', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = int(get_jwt_identity())
    search_query = request.args.get('q', '').strip()
    status_filter = request.args.get('status', 'all').lower()  # all, completed, active
    priority_filter = request.args.get('priority', '').lower()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    query = Task.query.filter_by(user_id=user_id)

    if search_query:
        query = query.filter(
            (Task.title.ilike(f'%{search_query}%')) | 
            (Task.description.ilike(f'%{search_query}%'))
        )

    if status_filter == 'completed':
        query = query.filter(Task.complete.is_(True))
    elif status_filter == 'active':
        query = query.filter(Task.complete.is_(False))

    if priority_filter in ['low', 'medium', 'high']:
        query = query.filter_by(priority=priority_filter)

    query = query.order_by(Task.complete.asc(), Task.created_at.desc())

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'tasks': [task.to_dict() for task in pagination.items],
        'total': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev
    }), 200

@tasks_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())
    total = Task.query.filter_by(user_id=user_id).count()
    completed = Task.query.filter_by(user_id=user_id, complete=True).count()
    active = total - completed
    return jsonify({
        'total': total,
        'completed': completed,
        'active': active
    }), 200

@tasks_bp.route('', methods=['POST'])
@jwt_required()
def create_task():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()
    priority = data.get('priority', 'medium').lower()
    due_date_str = data.get('due_date')

    if not title:
        return jsonify({'error': 'Task title is required.'}), 400

    if priority not in ['low', 'medium', 'high']:
        priority = 'medium'

    due_date = None
    if due_date_str:
        try:
            due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))
        except (ValueError, TypeError):
            pass

    new_task = Task(
        title=title,
        description=description,
        priority=priority,
        due_date=due_date,
        user_id=user_id
    )

    try:
        db.session.add(new_task)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to save task.'}), 500

    return jsonify({
        'message': 'Task created successfully!',
        'task': new_task.to_dict()
    }), 201

@tasks_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': 'Task not found.'}), 404
    return jsonify({'task': task.to_dict()}), 200

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': 'Task not found.'}), 404

    data = request.get_json(silent=True) or {}
    if 'title' in data:
        title = data.get('title', '').strip()
        if not title:
            return jsonify({'error': 'Title cannot be empty.'}), 400
        task.title = title

    if 'description' in data:
        task.description = data.get('description', '').strip()

    if 'complete' in data:
        task.complete = bool(data.get('complete'))

    if 'priority' in data:
        priority = data.get('priority', 'medium').lower()
        if priority in ['low', 'medium', 'high']:
            task.priority = priority

    if 'due_date' in data:
        due_date_str = data.get('due_date')
        if due_date_str:
            try:
                task.due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))
            except (ValueError, TypeError):
                pass
        else:
            task.due_date = None

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to update task.'}), 500

    return jsonify({
        'message': 'Task updated successfully!',
        'task': task.to_dict()
    }), 200

@tasks_bp.route('/<int:task_id>/toggle', methods=['PATCH'])
@jwt_required()
def toggle_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': 'Task not found.'}), 404

    task.complete = not task.complete
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to toggle task.'}), 500

    return jsonify({
        'message': f"Task marked as {'completed' if task.complete else 'active'}.",
        'task': task.to_dict()
    }), 200

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': 'Task not found.'}), 404

    try:
        db.session.delete(task)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete task.'}), 500

    return jsonify({'message': 'Task deleted successfully!'}), 200
