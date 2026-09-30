import React, { useState } from 'react';
import { PawPrint, LogOut, MessageSquarePlus, Sparkles, Flame } from 'lucide-react';
import { authService } from '../services/api';
import { adManager } from '../services/ads';
import CartoonAvatar from './CartoonAvatar';
import AvatarPicker from './AvatarPicker';

export default function Navbar({ user, onUpdateUser, onOpenFeedback, onRewardUnlock }) {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'dog');
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    authService.logout();
  };

  const handleWatchAd = () => {
    adManager.showRewarded(() => {
      if (onRewardUnlock) onRewardUnlock();
    });
  };

  const handleSaveAvatar = async () => {
    try {
      setSaving(true);
      const res = await authService.updateProfile({ avatar: selectedAvatar });
      if (onUpdateUser) onUpdateUser(res.user);
      setIsAvatarModalOpen(false);
    } catch (err) {
      alert('Failed to update avatar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand - FocusPaws */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-orange-100">
              <PawPrint className="w-5 h-5 fill-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black bg-linear-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                  FocusPaws
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{user?.streak || 0}</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Cute Task & Habit Companion
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Rewarded Ad / Perks */}
            <button
              onClick={handleWatchAd}
              title="Watch a quick ad to earn perks & support"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Pet Treats</span>
            </button>

            {/* Feedback */}
            <button
              onClick={onOpenFeedback}
              title="Send Feedback"
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-5 h-5" />
            </button>

            {/* User Profile display (Cartoon Avatar + Username beside Logout) */}
            {user && (
              <div className="flex items-center pl-2 sm:pl-3 border-l border-slate-200 gap-2.5">
                {/* Clickable cartoon avatar */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(user.avatar || 'dog');
                    setIsAvatarModalOpen(true);
                  }}
                  title="Click to switch companion avatar"
                  className="relative group transition-transform active:scale-95 cursor-pointer"
                >
                  <CartoonAvatar id={user.avatar || 'dog'} size="sm" />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                </button>

                {/* Username */}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate leading-tight">
                    {user.username || user.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-medium capitalize">
                    {user.avatar || 'Companion'}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Avatar Switcher Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-800 text-center mb-1">
              Choose Your Companion Pet
            </h3>
            <p className="text-xs text-slate-500 text-center mb-5">
              Select a cartoon buddy to accompany your productivity journey
            </p>

            <AvatarPicker
              selected={selectedAvatar}
              onSelect={(id) => setSelectedAvatar(id)}
            />

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveAvatar}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
              >
                {saving ? 'Saving...' : 'Set as Companion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
