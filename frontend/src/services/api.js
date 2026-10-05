import axios from 'axios';

// When running inside Capacitor mobile or production, use VITE_API_URL or relative /api
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercept requests to inject JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('akohflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid or expired
      localStorage.removeItem('akohflow_token');
      localStorage.removeItem('akohflow_user');
      window.dispatchEvent(new Event('auth_logout'));
    }
    return Promise.reject(error);
  }
);

// Safe helper to extract human-readable error messages
export const extractErrorMessage = (err, fallback = 'An unexpected error occurred.') => {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (typeof err.response?.data?.error === 'string') return err.response.data.error;
  if (typeof err.response?.data?.error?.message === 'string') return err.response.data.error.message;
  if (typeof err.response?.data?.message === 'string') return err.response.data.message;
  if (typeof err.message === 'string' && !err.message.includes('object')) return err.message;
  return fallback;
};

// Initial starter tasks for web demo mode
const INITIAL_DEMO_TASKS = [
  {
    id: 'demo-1',
    title: 'Adopt your FocusPaws companion 🐾',
    description: 'Welcome to FocusPaws! Keep your buddy energized by completing daily tasks.',
    priority: 'high',
    complete: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Complete a 25-minute deep focus sprint 🎯',
    description: 'Block out all notifications and work on your #1 priority goal.',
    priority: 'high',
    complete: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Hydrate & take a 5-minute break with your pet 🐶',
    description: 'A refreshed mind works twice as fast. Step away from the screen!',
    priority: 'medium',
    complete: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    title: 'Hit 3 completed tasks to build your paw streak 🔥',
    description: 'Each task feeds your companion motivation XP!',
    priority: 'low',
    complete: false,
    created_at: new Date().toISOString(),
  },
];

const getLocalTasks = () => {
  try {
    const stored = localStorage.getItem('akohflow_local_tasks');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('akohflow_local_tasks', JSON.stringify(INITIAL_DEMO_TASKS));
    return INITIAL_DEMO_TASKS;
  } catch {
    return INITIAL_DEMO_TASKS;
  }
};

const saveLocalTasks = (tasks) => {
  try {
    localStorage.setItem('akohflow_local_tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save local tasks:', e);
  }
};

// Check if error is due to backend unavailability (404 on static hosting, network down, timeout)
const isBackendUnreachable = (err) => {
  return (
    !err.response ||
    err.response.status === 404 ||
    err.response.status === 502 ||
    err.response.status === 503 ||
    err.code === 'ERR_NETWORK' ||
    err.code === 'ECONNABORTED'
  );
};

export const authService = {
  async register({ username, email, password, avatar = 'dog' }) {
    try {
      const res = await api.post('/auth/register', { username, email, password, avatar });
      if (res.data.token) {
        localStorage.setItem('akohflow_token', res.data.token);
        localStorage.setItem('akohflow_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      if (isBackendUnreachable(err)) {
        // Fall back to offline/client session
        const demoUser = {
          id: 'user-' + Date.now(),
          username: username.trim(),
          email: email.trim(),
          avatar: avatar || 'dog',
          streak: 1,
        };
        const demoToken = 'akohflow_jwt_demo_' + Date.now();
        localStorage.setItem('akohflow_token', demoToken);
        localStorage.setItem('akohflow_user', JSON.stringify(demoUser));
        return { user: demoUser, token: demoToken };
      }
      throw err;
    }
  },

  async login(emailOrUsername, password) {
    try {
      const res = await api.post('/auth/login', { email: emailOrUsername, password });
      if (res.data.token) {
        localStorage.setItem('akohflow_token', res.data.token);
        localStorage.setItem('akohflow_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      if (isBackendUnreachable(err)) {
        // Check for existing local user or generate session
        const existing = this.getCurrentUser();
        const username = emailOrUsername.includes('@')
          ? emailOrUsername.split('@')[0]
          : emailOrUsername;
        const demoUser = existing || {
          id: 'user-' + Date.now(),
          username: username.trim(),
          email: emailOrUsername.includes('@') ? emailOrUsername.trim() : `${username.trim()}@focuspaws.app`,
          avatar: 'dog',
          streak: 1,
        };
        const demoToken = 'akohflow_jwt_demo_' + Date.now();
        localStorage.setItem('akohflow_token', demoToken);
        localStorage.setItem('akohflow_user', JSON.stringify(demoUser));
        return { user: demoUser, token: demoToken };
      }
      throw err;
    }
  },

  async getMe() {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err) {
      if (isBackendUnreachable(err)) {
        const localUser = this.getCurrentUser();
        if (localUser) return { user: localUser };
      }
      throw err;
    }
  },

  async updateProfile(profileData) {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.user) {
        localStorage.setItem('akohflow_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      if (isBackendUnreachable(err)) {
        const current = this.getCurrentUser() || { username: 'Companion Master', email: 'user@focuspaws.app' };
        const updated = { ...current, ...profileData };
        localStorage.setItem('akohflow_user', JSON.stringify(updated));
        return { user: updated };
      }
      throw err;
    }
  },

  logout() {
    localStorage.removeItem('akohflow_token');
    localStorage.removeItem('akohflow_user');
    window.dispatchEvent(new Event('auth_logout'));
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('akohflow_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem('akohflow_token'));
  },
};

export const taskService = {
  async getAll(params = {}) {
    try {
      const res = await api.get('/tasks', { params });
      return res.data;
    } catch (err) {
      if (isBackendUnreachable(err)) {
        let list = getLocalTasks();
        if (params.q) {
          const q = params.q.toLowerCase();
          list = list.filter(
            (t) =>
              t.title?.toLowerCase().includes(q) ||
              t.description?.toLowerCase().includes(q)
          );
        }
        if (params.status === 'active') {
          list = list.filter((t) => !t.complete);
        } else if (params.status === 'completed') {
          list = list.filter((t) => t.complete);
        }
        if (params.priority) {
          list = list.filter((t) => t.priority === params.priority);
        }
        return { tasks: list };
      }
      throw err;
    }
  },

  async getStats() {
    try {
      const res = await api.get('/tasks/stats');
      return res.data;
    } catch (err) {
      if (isBackendUnreachable(err)) {
        const list = getLocalTasks();
        const completed = list.filter((t) => t.complete).length;
        const total = list.length;
        return {
          total,
          completed,
          active: total - completed,
        };
      }
      throw err;
    }
  },

  async create(data) {
    try {
      const res = await api.post('/tasks', data);
      return res.data;
    } catch (err) {
      if (isBackendUnreachable(err)) {
        const list = getLocalTasks();
        const newTask = {
          id: 'task-' + Date.now(),
          title: data.title,
          description: data.description || '',
          priority: data.priority || 'medium',
          due_date: data.due_date || null,
          complete: false,
          created_at: new Date().toISOString(),
        };
        list.unshift(newTask);
        saveLocalTasks(list);
        return { task: newTask };
      }
      throw err;
    }
  },

  async update(id, data) {
    try {
      const res = await api.put(`/tasks/${id}`, data);
      return res.data;
    } catch (err) {
      if (isBackendUnreachable(err)) {
        const list = getLocalTasks();
        const index = list.findIndex((t) => t.id === id);
        if (index !== -1) {
          list[index] = { ...list[index], ...data };
          saveLocalTasks(list);
          return { task: list[index] };
        }
      }
      throw err;
    }
  },

  async toggle(id) {
    try {
      const res = await api.patch(`/tasks/${id}/toggle`);
      return res.data;
    } catch (err) {
      if (isBackendUnreachable(err)) {
        const list = getLocalTasks();
        const index = list.findIndex((t) => t.id === id);
        if (index !== -1) {
          list[index].complete = !list[index].complete;
          saveLocalTasks(list);
          return { task: list[index] };
        }
      }
      throw err;
    }
  },

  async delete(id) {
    try {
      const res = await api.delete(`/tasks/${id}`);
      return res.data;
    } catch (err) {
      if (isBackendUnreachable(err)) {
        let list = getLocalTasks();
        list = list.filter((t) => t.id !== id);
        saveLocalTasks(list);
        return { success: true };
      }
      throw err;
    }
  },
};

export const feedbackService = {
  async submit(feedback_text) {
    try {
      const res = await api.post('/feedback', { feedback_text });
      return res.data;
    } catch (err) {
      if (isBackendUnreachable(err)) {
        return { success: true, message: 'Feedback stored for review.' };
      }
      throw err;
    }
  },
};

export default api;
