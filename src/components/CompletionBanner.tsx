import React from 'react';
import { Award, CheckCircle, ArrowRight } from 'lucide-react';
import { TabKey } from '../types/adhkar.ts';

interface CompletionBannerProps {
  categoryLabel: string;
  onGoToNextTab: (nextTab: TabKey) => void;
  nextTabLabel: string;
  nextTabKey: TabKey;
}

export const CompletionBanner: React.FC<CompletionBannerProps> = ({
  categoryLabel,
  onGoToNextTab,
  nextTabLabel,
  nextTabKey,
}) => {
  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 mb-5 shadow-lg border border-emerald-400/40 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
        <Award className="w-6 h-6 text-amber-300" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">
        Māshā'Allāh! Completed All {categoryLabel}
      </h3>
      <p className="text-xs text-emerald-100 max-w-sm mx-auto mb-3.5 leading-relaxed">
        “Whoever remembers his Lord and whoever does not remember his Lord are like the living and the dead.” (Sahih al-Bukhari)
      </p>

      <button
        onClick={() => onGoToNextTab(nextTabKey)}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-teal-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
      >
        <span>Continue to {nextTabLabel}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
