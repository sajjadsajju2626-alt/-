import React, { useState } from 'react';
import { Smartphone, X, Sparkles, Plus } from 'lucide-react';

interface PWAInstallBannerProps {
  isInstalled: boolean;
  onOpenInstallModal: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  isInstalled,
  onOpenInstallModal,
}) => {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('adhkar_install_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  if (isInstalled || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('adhkar_install_banner_dismissed', 'true');
    } catch {}
  };

  return (
    <aside
      aria-label="Add Daily Adhkar to Home Screen"
      className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 text-white px-3.5 py-2.5 shadow-sm border-b border-teal-600/50"
    >
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-teal-900/80 text-amber-300 flex items-center justify-center text-sm shrink-0 border border-teal-600/60">
            📿
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
              <span>Add to Home Screen</span>
              <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-amber-400 text-teal-950 font-bold shrink-0">
                Offline Ready
              </span>
            </p>
            <p className="text-[11px] text-teal-100 truncate">
              Instant 1-tap daily access without browser address bar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenInstallModal}
            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-teal-950 font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Now</span>
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss add to home screen banner"
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
