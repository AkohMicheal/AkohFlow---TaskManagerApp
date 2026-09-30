import pytest
from app import create_app
from models import db, User, Task

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def test_health_check(client):
    res = client.get('/api/health')
    assert res.status_code == 200
    assert res.get_json()['status'] == 'healthy'

def test_auth_workflow(client):
    # Register with username and avatar
    reg_res = client.post('/api/auth/register', json={
        'username': 'micheal_dev',
        'email': 'micheal@example.com',
        'password': 'password123',
        'avatar': 'panda'
    })
    assert reg_res.status_code == 201
    reg_data = reg_res.get_json()
    assert 'token' in reg_data
    assert reg_data['user']['username'] == 'micheal_dev'
    assert reg_data['user']['avatar'] == 'panda'

    # Duplicate username should fail
    dup_res = client.post('/api/auth/register', json={
        'username': 'micheal_dev',
        'email': 'other@example.com',
        'password': 'password123'
    })
    assert dup_res.status_code == 409

    # Login with username instead of email
    login_res = client.post('/api/auth/login', json={
        'email': 'micheal_dev',
        'password': 'password123'
    })
    assert login_res.status_code == 200
    token = login_res.get_json()['token']

    # Current user info
    me_res = client.get('/api/auth/me', headers={'Authorization': f'Bearer {token}'})
    assert me_res.status_code == 200
    assert me_res.get_json()['user']['username'] == 'micheal_dev'

    # Profile avatar update
    prof_res = client.put('/api/auth/profile', headers={'Authorization': f'Bearer {token}'}, json={
        'avatar': 'fox'
    })
    assert prof_res.status_code == 200
    assert prof_res.get_json()['user']['avatar'] == 'fox'

def test_task_workflow(client):
    # Register user
    reg_res = client.post('/api/auth/register', json={
        'username': 'task_runner',
        'email': 'tasks@example.com',
        'password': 'secretpassword',
        'avatar': 'dog'
    })
    token = reg_res.get_json()['token']
    auth_header = {'Authorization': f'Bearer {token}'}

    # Unauthorized access check
    unauth = client.get('/api/tasks')
    assert unauth.status_code == 401

    # Create task
    create_res = client.post('/api/tasks', headers=auth_header, json={
        'title': 'Test New Task',
        'description': 'Task details description',
        'priority': 'high'
    })
    assert create_res.status_code == 201
    task_id = create_res.get_json()['task']['id']

    # Get tasks
    list_res = client.get('/api/tasks', headers=auth_header)
    assert list_res.status_code == 200
    tasks = list_res.get_json()['tasks']
    assert len(tasks) == 1
    assert tasks[0]['title'] == 'Test New Task'

    # Toggle task complete
    toggle_res = client.patch(f'/api/tasks/{task_id}/toggle', headers=auth_header)
    assert toggle_res.status_code == 200
    assert toggle_res.get_json()['task']['complete'] is True

    # Check stats
    stats_res = client.get('/api/tasks/stats', headers=auth_header)
    assert stats_res.status_code == 200
    assert stats_res.get_json()['completed'] == 1
    assert stats_res.get_json()['active'] == 0

    # Delete task
    del_res = client.delete(f'/api/tasks/{task_id}', headers=auth_header)
    assert del_res.status_code == 200

    # Verify task deleted
    list_after = client.get('/api/tasks', headers=auth_header)
    assert len(list_after.get_json()['tasks']) == 0

def test_feedback(client):
    fb_res = client.post('/api/feedback', json={
        'feedback_text': 'FocusPaws is amazing! The cartoon avatars rock.'
    })
    assert fb_res.status_code == 201
    assert 'Thank you' in fb_res.get_json()['message']
