import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  CheckCircle,
  Clock,
  ListTodo,
  Filter,
  Sparkles,
  Flame,
  AlertCircle
} from 'lucide-react';
import { taskService } from '../services/api';
import { adManager } from '../services/ads';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import AdBanner from '../components/AdBanner';
import CartoonAvatar, { AVATAR_LIST } from '../components/CartoonAvatar';

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, completed
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [celebration, setCelebration] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const companion = AVATAR_LIST.find((a) => a.id === user?.avatar) || AVATAR_LIST[0];

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [taskRes, statsRes] = await Promise.all([
        taskService.getAll({
          q: search,
          status: statusFilter,
          priority: priorityFilter,
        }),
        taskService.getStats(),
      ]);

      setTasks(taskRes.tasks || []);
      setStats(statsRes);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Check connection to API.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle task completion toggle with companion celebration
  const handleToggle = async (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    const willBeCompleted = target && !target.complete;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, complete: !t.complete } : t))
    );

    if (willBeCompleted) {
      setCelebration(`🎉 ${companion.name} is proud of you! Task completed!`);
      setTimeout(() => setCelebration(''), 3500);
      adManager.recordTaskAction();
    }

    try {
      await taskService.toggle(taskId);
      const statsRes = await taskService.getStats();
      setStats(statsRes);
    } catch (err) {
      fetchTasks(); // Rollback if failed
    }
  };

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      await taskService.update(editingTask.id, taskData);
    } else {
      await taskService.create(taskData);
    }
    fetchTasks();
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.delete(taskId);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 sm:pb-12">
      {/* Top Banner Ad slot (Web) */}
      <AdBanner slotId="top-dashboard" />

      {/* Floating Celebration Toast */}
      {celebration && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-xl border border-white/30 animate-bounce">
          {celebration}
        </div>
      )}

      {/* Companion Mascot Hero Card (The Standout Feature) */}
      <div className="bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 mb-6 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 relative overflow-hidden">
        {/* Background decorative paw prints */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none" />
        
        {/* Mascot Avatar */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="p-1 rounded-full bg-white/10 ring-4 ring-white/10 shadow-lg">
            <CartoonAvatar id={user?.avatar || 'dog'} size="xl" />
          </div>
          <span className="text-[11px] font-bold text-amber-300 mt-2">
            {companion.name} the {companion.type}
          </span>
        </div>

        {/* Mascot speech & stats */}
        <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold w-fit mx-auto sm:mx-0 mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
            <span>Companion Motivation</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white">
            "{companion.quote}"
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            {stats.active > 0
              ? `You have ${stats.active} task${stats.active > 1 ? 's' : ''} left today. Let's finish strong!`
              : stats.total > 0
              ? 'All clear! Every single task is done. Outstanding focus!'
              : 'Add your first task below to start building your streak!'}
          </p>

          {/* Paw Streak Indicator */}
          <div className="mt-3.5 flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-semibold text-slate-400">Paw Streak:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i <= Math.min(stats.completed, 5) ? 'opacity-100 scale-110' : 'opacity-25 grayscale'
                  }`}
                  title={`Streak level ${i}`}
                >
                  🐾
                </span>
              ))}
            </div>
            <span className="text-xs font-bold text-emerald-400 ml-1">
              {stats.completed} Done
            </span>
          </div>
        </div>

        {/* Quick Add CTA */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={openNewTaskModal}
            className="px-4 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{stats.total}</div>
            <div className="text-[11px] font-medium text-slate-400">Total</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{stats.active}</div>
            <div className="text-[11px] font-medium text-slate-400">In Progress</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{stats.completed}</div>
            <div className="text-[11px] font-medium text-slate-400">Completed</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search + Filters */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <button
            onClick={openNewTaskModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs shadow-indigo-200 transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs bg-transparent border-none text-slate-700 font-medium focus:ring-0 cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Task List */}
      {loading ? (
        <div className="space-y-3 py-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-18 bg-white border border-slate-200/60 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <div className="inline-block p-3 rounded-full bg-amber-50 mb-3">
            <CartoonAvatar id={user?.avatar || 'dog'} size="lg" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {search ? 'No matching tasks' : `${companion.name} is waiting for tasks!`}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {search
              ? 'Try another search query or clear the filter.'
              : 'Add your first task to start feeding your companion with productivity XP!'}
          </p>
          <button
            onClick={openNewTaskModal}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Task</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Bottom AdBanner slot (Web) */}
      <div className="mt-8">
        <AdBanner slotId="bottom-dashboard" />
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <button
        onClick={openNewTaskModal}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-linear-to-tr from-amber-500 to-rose-500 text-white rounded-full shadow-xl shadow-orange-300 flex items-center justify-center active:scale-95 transition-all z-30 cursor-pointer"
        aria-label="Add Task"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}
