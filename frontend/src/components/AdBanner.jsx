import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { adManager } from '../services/ads';

export default function AdBanner({ slotId = 'default-slot', format = 'auto' }) {
  useEffect(() => {
    // If running on native mobile device, show native AdMob banner
    if (adManager.isNative) {
      adManager.showBanner();
      return () => {
        adManager.hideBanner();
      };
    }
  }, []);

  // On native mobile, the native banner is anchored by AdMob SDK
  if (adManager.isNative) {
    return null;
  }

  // On Web: Render responsive Google AdSense container or preview banner
  return (
    <div className="w-full my-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white border border-dashed border-indigo-200 rounded-xl p-3 flex items-center justify-between shadow-xs hover:border-indigo-300 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase tracking-wider">
            Ad
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-800">Advertisement</span>
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-xs text-slate-500">
              Support AkohFlow by keeping ads active • Google AdSense
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
          Responsive Banner
        </span>
      </div>
    </div>
  );
}
