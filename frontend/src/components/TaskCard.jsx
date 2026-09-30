import React from 'react';
import { Check, Calendar, Edit3, Trash2, Clock } from 'lucide-react';

const PRIORITY_BADGES = {
  high: { label: 'High', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  medium: { label: 'Medium', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  low: { label: 'Low', bg: 'bg-blue-50 text-blue-700 border-blue-200' }
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const priorityStyle = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium;

  const formattedDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      className={`group relative bg-white rounded-xl border transition-all duration-200 p-4 shadow-xs hover:shadow-md ${
        task.complete
          ? 'border-slate-200/80 bg-slate-50/50'
          : 'border-slate-200 hover:border-indigo-200'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox button */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            task.complete
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs shadow-emerald-200'
              : 'border-slate-300 hover:border-indigo-500 bg-white'
          }`}
          aria-label={task.complete ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.complete && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3
              className={`text-sm font-semibold truncate transition-all ${
                task.complete ? 'line-through text-slate-400' : 'text-slate-800'
              }`}
            >
              {task.title}
            </h3>

            {/* Priority tag */}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityStyle.bg}`}
            >
              {priorityStyle.label}
            </span>

            {/* Due Date */}
            {formattedDate && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            )}
          </div>

          {task.description && (
            <p
              className={`text-xs mt-1 leading-relaxed ${
                task.complete ? 'line-through text-slate-400' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Actions (visible on hover or tap) */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
