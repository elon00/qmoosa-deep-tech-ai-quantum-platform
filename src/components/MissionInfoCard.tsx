import React from 'react';
import { Mission } from '../data/missions';
import { Shield, Target, Lightbulb, Play, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';

interface MissionInfoCardProps {
  mission: Mission;
  onVerify: () => void;
  verificationResult: { success: boolean; feedback: string; score: number } | null;
  onNextMission: () => void;
  isLastMission: boolean;
}

export const MissionInfoCard: React.FC<MissionInfoCardProps> = ({
  mission,
  onVerify,
  verificationResult,
  onNextMission,
  isLastMission,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold uppercase tracking-wider">
            {mission.subtitle}
          </span>
          <h2 className="text-lg font-bold text-white tracking-wide mt-1">
            {mission.title}
          </h2>
        </div>

        {/* Verification Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onVerify}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-current" /> Execute & Verify
          </button>

          {verificationResult?.success && !isLastMission && (
            <button
              onClick={onNextMission}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 animate-bounce"
            >
              Next Mission <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-300 font-sans mb-3 leading-relaxed">
        {mission.description}
      </p>

      {/* Grid info: Context, Target, Quick Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5" /> Story & Q-Day Context
          </span>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            {mission.storyContext}
          </p>
        </div>

        <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 mb-1">
            <Target className="w-3.5 h-3.5" /> Target Criteria
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {mission.targetStateDescription}
          </p>
        </div>

        <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
          <span className="text-amber-400 font-bold flex items-center gap-1.5 mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Quick Guide
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {mission.quickGuide}
          </p>
        </div>
      </div>

      {/* Verification Feedback Alert */}
      {verificationResult && (
        <div
          className={`mt-3 p-3 rounded-xl border flex items-center justify-between font-mono text-xs ${
            verificationResult.success
              ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
              : 'bg-red-950/80 border-red-500/80 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {verificationResult.success ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <div>
              <p className="font-bold">{verificationResult.feedback}</p>
            </div>
          </div>
          <span className="text-sm font-bold font-mono">
            Score: {verificationResult.score}/100
          </span>
        </div>
      )}
    </div>
  );
};
