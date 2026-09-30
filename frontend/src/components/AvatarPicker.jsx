import React from 'react';
import CartoonAvatar, { AVATAR_LIST } from './CartoonAvatar';

export default function AvatarPicker({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
      {AVATAR_LIST.map((item) => {
        const isSelected = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`flex flex-col items-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
              isSelected
                ? 'border-indigo-600 bg-indigo-50/70 shadow-sm scale-102 ring-2 ring-indigo-200'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <CartoonAvatar id={item.id} size="md" />
            <span className={`text-[11px] font-bold mt-1.5 ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
              {item.name}
            </span>
            <span className="text-[9px] text-slate-400 capitalize">{item.type}</span>
          </button>
        );
      })}
    </div>
  );
}
