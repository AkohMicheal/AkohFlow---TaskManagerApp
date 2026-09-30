import React from 'react';

export const AVATAR_LIST = [
  { id: 'dog', name: 'Buddy', type: 'Dog', quote: 'Ready to fetch some tasks!' },
  { id: 'cat', name: 'Milo', type: 'Cat', quote: 'Pawsitively productive!' },
  { id: 'sheep', name: 'Woolly', type: 'Sheep', quote: 'Counting tasks, not sheep!' },
  { id: 'panda', name: 'Bao', type: 'Panda', quote: 'Zen, calm, and focused.' },
  { id: 'fox', name: 'Rusty', type: 'Fox', quote: 'Clever moves today!' },
  { id: 'rabbit', name: 'Hoppy', type: 'Bunny', quote: 'Hop right into it!' },
  { id: 'bear', name: 'Barnaby', type: 'Bear', quote: 'Unstoppable momentum.' },
  { id: 'lion', name: 'Leo', type: 'Lion', quote: 'King of productivity!' }
];

export default function CartoonAvatar({ id = 'dog', size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size] || 'w-10 h-10';

  const avatar = id?.toLowerCase() || 'dog';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden shadow-xs select-none ${sizeClasses} ${className}`}>
      {/* Dog - Buddy */}
      {avatar === 'dog' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="#FDE68A" />
          {/* Ears */}
          <path d="M15 30 C10 15 28 8 32 24 Z" fill="#D97706" />
          <path d="M85 30 C90 15 72 8 68 24 Z" fill="#D97706" />
          {/* Head */}
          <ellipse cx="50" cy="54" rx="34" ry="30" fill="#F59E0B" />
          {/* Muzzle */}
          <ellipse cx="50" cy="62" rx="18" ry="14" fill="#FEF3C7" />
          {/* Nose */}
          <ellipse cx="50" cy="56" rx="6" ry="4.5" fill="#451A03" />
          {/* Mouth & Tongue */}
          <path d="M50 60 Q50 66 45 68 M50 60 Q50 66 55 68" stroke="#451A03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M47 67 Q50 75 53 67 Z" fill="#F43F5E" />
          {/* Eyes */}
          <circle cx="38" cy="48" r="4.5" fill="#451A03" />
          <circle cx="36.5" cy="46.5" r="1.5" fill="#FFF" />
          <circle cx="62" cy="48" r="4.5" fill="#451A03" />
          <circle cx="60.5" cy="46.5" r="1.5" fill="#FFF" />
        </svg>
      )}

      {/* Cat - Milo */}
      {avatar === 'cat' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="#E9D5FF" />
          {/* Pointy Ears */}
          <polygon points="20,40 28,12 44,30" fill="#C084FC" />
          <polygon points="26,35 30,20 40,28" fill="#F472B6" />
          <polygon points="80,40 72,12 56,30" fill="#C084FC" />
          <polygon points="74,35 70,20 60,28" fill="#F472B6" />
          {/* Head */}
          <circle cx="50" cy="54" r="32" fill="#A855F7" />
          {/* Whiskers */}
          <line x1="20" y1="58" x2="36" y2="60" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="65" x2="36" y2="64" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="80" y1="58" x2="64" y2="60" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="65" x2="64" y2="64" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="38" cy="49" rx="5" ry="4" fill="#3B0764" />
          <circle cx="36.5" cy="47.5" r="1.5" fill="#FFF" />
          <ellipse cx="62" cy="49" rx="5" ry="4" fill="#3B0764" />
          <circle cx="60.5" cy="47.5" r="1.5" fill="#FFF" />
          {/* Cute Nose */}
          <polygon points="50,57 47,54 53,54" fill="#F472B6" />
          {/* Mouth */}
          <path d="M46 62 Q50 65 54 62" stroke="#3B0764" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )}

      {/* Sheep - Woolly */}
      {avatar === 'sheep' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="#A7F3D0" />
          {/* Fluffy Wool Head Puffs */}
          <circle cx="50" cy="30" r="16" fill="#FFFFFF" />
          <circle cx="34" cy="36" r="15" fill="#FFFFFF" />
          <circle cx="66" cy="36" r="15" fill="#FFFFFF" />
          <circle cx="28" cy="52" r="14" fill="#FFFFFF" />
          <circle cx="72" cy="52" r="14" fill="#FFFFFF" />
          <circle cx="36" cy="68" r="14" fill="#FFFFFF" />
          <circle cx="64" cy="68" r="14" fill="#FFFFFF" />
          <circle cx="50" cy="72" r="14" fill="#FFFFFF" />
          {/* Sheep Face */}
          <ellipse cx="50" cy="52" rx="20" ry="18" fill="#FBCFE8" />
          {/* Droopy Ears */}
          <ellipse cx="26" cy="48" rx="8" ry="4.5" transform="rotate(-25 26 48)" fill="#F472B6" />
          <ellipse cx="74" cy="48" rx="8" ry="4.5" transform="rotate(25 74 48)" fill="#F472B6" />
          {/* Eyes */}
          <ellipse cx="43" cy="49" rx="3" ry="4" fill="#475569" />
          <circle cx="42" cy="47.5" r="1.2" fill="#FFF" />
          <ellipse cx="57" cy="49" rx="3" ry="4" fill="#475569" />
          <circle cx="56" cy="47.5" r="1.2" fill="#FFF" />
          {/* Smile */}
          <ellipse cx="50" cy="56" rx="2" ry="1.5" fill="#BE185D" />
          <path d="M47 59 Q50 63 53 59" stroke="#BE185D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      )}

      {/* Panda - Bao */}
      {avatar === 'panda' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="#E2E8F0" />
          {/* Black Ears */}
          <circle cx="25" cy="26" r="13" fill="#1E293B" />
          <circle cx="75" cy="26" r="13" fill="#1E293B" />
          {/* White Head */}
          <circle cx="50" cy="53" r="33" fill="#FFFFFF" />
          {/* Eye Patches */}
          <ellipse cx="37" cy="48" rx="10" ry="8" transform="rotate(-15 37 48)" fill="#1E293B" />
          <ellipse cx="63" cy="48" rx="10" ry="8" transform="rotate(15 63 48)" fill="#1E293B" />
          {/* Eyes inside patches */}
          <circle cx="37" cy="47" r="3.5" fill="#FFF" />
          <circle cx="37" cy="47" r="2" fill="#0F172A" />
          <circle cx="63" cy="47" r="3.5" fill="#FFF" />
          <circle cx="63" cy="47" r="2" fill="#0F172A" />
          {/* Panda Nose */}
          <ellipse cx="50" cy="59" rx="5" ry="3.5" fill="#0F172A" />
          <path d="M47 64 Q50 67 53 64" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )}

      {/* Fox - Rusty */}
      {avatar === 'fox' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="#FED7AA" />
          {/* Large Ears */}
          <polygon points="16,42 26,10 46,30" fill="#EA580C" />
          <polygon points="24,36 30,20 40,28" fill="#1E293B" />
          <polygon points="84,42 74,10 54,30" fill="#EA580C" />
          <polygon points="76,36 70,20 60,28" fill="#1E293B" />
          {/* Head */}
          <polygon points="50,78 18,38 82,38" fill="#F97316" />
          {/* White Cheeks */}
          <polygon points="50,78 20,44 42,48" fill="#FFF" />
          <polygon points="50,78 80,44 58,48" fill="#FFF" />
          {/* Eyes */}
          <circle cx="38" cy="44" r="3.8" fill="#1E293B" />
          <circle cx="37" cy="43" r="1.2" fill="#FFF" />
          <circle cx="62" cy="44" r="3.8" fill="#1E293B" />
          <circle cx="61" cy="43" r="1.2" fill="#FFF" />
          {/* Black Nose Tip */}
          <circle cx="50" cy="74" r="4.5" fill="#1E293B" />
        </svg>
      )}

      {/* Bunny - Hoppy */}
      {avatar === 'rabbit' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="#FECDD3" />
          {/* Tall Ears */}
          <ellipse cx="36" cy="24" rx="8" ry="20" transform="rotate(-10 36 24)" fill="#FFFFFF" />
          <ellipse cx="36" cy="24" rx="4.5" ry="14" transform="rotate(-10 36 24)" fill="#FB7185" />
          <ellipse cx="64" cy="24" rx="8" ry="20" transform="rotate(10 64 24)" fill="#FFFFFF" />
          <ellipse cx="64" cy="24" rx="4.5" ry="14" transform="rotate(10 64 24)" fill="#FB7185" />
          {/* Head */}
          <circle cx="50" cy="58" r="30" fill="#FFFFFF" />
          {/* Cheeks */}
          <circle cx="34" cy="62" r="5" fill="#FFE4E6" />
          <circle cx="66" cy="62" r="5" fill="#FFE4E6" />
          {/* Eyes */}
          <ellipse cx="40" cy="52" rx="4" ry="5" fill="#881337" />
          <circle cx="39" cy="50" r="1.5" fill="#FFF" />
          <ellipse cx="60" cy="52" rx="4" ry="5" fill="#881337" />
          <circle cx="59" cy="50" r="1.5" fill="#FFF" />
          {/* Nose & Mouth */}
          <polygon points="50,60 48,58 52,58" fill="#FB7185" />
          <path d="M47 64 Q50 67 53 64" stroke="#881337" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      )}

      {/* Bear - Barnaby */}
      {avatar === 'bear' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="#E7E5E4" />
          {/* Round Ears */}
          <circle cx="24" cy="26" r="12" fill="#78350F" />
          <circle cx="24" cy="26" r="6" fill="#FDE68A" />
          <circle cx="76" cy="26" r="12" fill="#78350F" />
          <circle cx="76" cy="26" r="6" fill="#FDE68A" />
          {/* Head */}
          <circle cx="50" cy="53" r="32" fill="#92400E" />
          {/* Muzzle */}
          <ellipse cx="50" cy="63" rx="16" ry="12" fill="#FDE68A" />
          <ellipse cx="50" cy="59" rx="6" ry="4" fill="#451A03" />
          <path d="M47 66 Q50 69 53 66" stroke="#451A03" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="38" cy="47" r="3.5" fill="#1C1917" />
          <circle cx="37" cy="46" r="1" fill="#FFF" />
          <circle cx="62" cy="47" r="3.5" fill="#1C1917" />
          <circle cx="61" cy="46" r="1" fill="#FFF" />
        </svg>
      )}

      {/* Lion - Leo */}
      {avatar === 'lion' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="#FEF08A" />
          {/* Mane */}
          <circle cx="50" cy="52" r="38" fill="#B45309" />
          {/* Ears */}
          <circle cx="26" cy="30" r="10" fill="#F59E0B" />
          <circle cx="74" cy="30" r="10" fill="#F59E0B" />
          {/* Head */}
          <circle cx="50" cy="54" r="28" fill="#FBBF24" />
          {/* Muzzle */}
          <ellipse cx="50" cy="62" rx="14" ry="10" fill="#FEF3C7" />
          <polygon points="50,59 46,55 54,55" fill="#451A03" />
          <path d="M47 64 Q50 67 53 64" stroke="#451A03" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="41" cy="49" r="3.5" fill="#451A03" />
          <circle cx="40" cy="48" r="1" fill="#FFF" />
          <circle cx="59" cy="49" r="3.5" fill="#451A03" />
          <circle cx="58" cy="48" r="1" fill="#FFF" />
        </svg>
      )}
    </div>
  );
}
