import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

export const QDayDoomsdayClock: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const target = new Date('2028-03-08T05:53:49Z').getTime();

    const updateClock = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const totalSec = Math.floor(diff / 1000);
      const sec = totalSec % 60;
      const totalMin = Math.floor(totalSec / 60);
      const min = totalMin % 60;
      const totalHrs = Math.floor(totalMin / 60);
      const hrs = totalHrs % 24;
      const totalDays = Math.floor(totalHrs / 24);

      const yrs = Math.floor(totalDays / 365);
      const remDaysAfterYrs = totalDays % 365;
      const mo = Math.floor(remDaysAfterYrs / 30);
      const days = remDaysAfterYrs % 30;

      setTimeLeft({
        years: yrs,
        months: mo,
        days: days,
        hours: hrs,
        minutes: min,
        seconds: sec
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0c0000] border-2 border-red-500/60 p-6 sm:p-8 space-y-6 shadow-[0_0_35px_rgba(255,0,60,0.25)] relative overflow-hidden font-mono">
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-500/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/20 border border-red-500 rounded-sm shrink-0">
            <Clock className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-red-500 text-black font-black text-[10px] uppercase tracking-widest animate-pulse">
                LIVE CRITICAL COUNTDOWN
              </span>
              <span className="text-white/50 text-[10px]">QUANTUMDOOMCLOCK.COM SYNCHRONIZED</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-1 flex items-center gap-2">
              <span>Q-DAY DOOMSDAY CLOCK</span>
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#110000] p-3 border border-red-500/40 text-xs shrink-0">
          <div className="text-right">
            <span className="text-[9px] text-red-400/70 block uppercase font-bold">EXACT Q-DAY TARGET</span>
            <span className="text-white font-bold text-sm">Wed, 08 Mar 2028 05:53:49 GMT</span>
          </div>
          <div className="h-8 w-[1px] bg-red-500/30" />
          <div className="text-right">
            <span className="text-[9px] text-red-400/70 block uppercase font-bold">THREAT LEVEL</span>
            <span className="text-red-500 font-black text-sm">LEVEL 5 / 5 (CRITICAL)</span>
          </div>
        </div>
      </div>

      {/* Live Ticking Countdown Units */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
        <div className="bg-[#180003] border border-red-500/50 p-3 rounded-sm shadow-inner">
          <span className="text-3xl sm:text-4xl font-black text-red-500 font-mono block tracking-tight">{timeLeft.years}</span>
          <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest mt-1 block">YRS</span>
        </div>
        <div className="bg-[#180003] border border-red-500/50 p-3 rounded-sm shadow-inner">
          <span className="text-3xl sm:text-4xl font-black text-red-500 font-mono block tracking-tight">{timeLeft.months}</span>
          <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest mt-1 block">MO</span>
        </div>
        <div className="bg-[#180003] border border-red-500/50 p-3 rounded-sm shadow-inner">
          <span className="text-3xl sm:text-4xl font-black text-red-500 font-mono block tracking-tight">{timeLeft.days}</span>
          <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest mt-1 block">DAYS</span>
        </div>
        <div className="bg-[#180003] border border-red-500/50 p-3 rounded-sm shadow-inner">
          <span className="text-3xl sm:text-4xl font-black text-red-400 font-mono block tracking-tight">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest mt-1 block">HR</span>
        </div>
        <div className="bg-[#180003] border border-red-500/50 p-3 rounded-sm shadow-inner">
          <span className="text-3xl sm:text-4xl font-black text-red-400 font-mono block tracking-tight">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest mt-1 block">MIN</span>
        </div>
        <div className="bg-[#180003] border-2 border-red-500 p-3 rounded-sm shadow-inner bg-red-950/20 col-span-2 sm:col-span-1">
          <span className="text-3xl sm:text-4xl font-black text-red-400 font-mono block tracking-tight animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-[10px] text-red-400 uppercase font-bold tracking-widest mt-1 block">SEC</span>
        </div>
      </div>

      {/* Real-time Impact Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-[11px]">
        <div className="p-3 bg-[#110000] border border-white/10 flex justify-between items-center">
          <span className="text-white/60">VULNERABLE CAPITAL AT RISK:</span>
          <strong className="text-amber-400 font-bold">$1.42 TRILLION</strong>
        </div>
        <div className="p-3 bg-[#110000] border border-white/10 flex justify-between items-center">
          <span className="text-white/60">CRQC HARDWARE PROGRESS:</span>
          <strong className="text-red-400 font-bold">68.4% COMPLETE</strong>
        </div>
        <div className="p-3 bg-[#110000] border border-white/10 flex justify-between items-center">
          <span className="text-white/60">TARGET ALGORITHMS:</span>
          <strong className="text-cyan-400 font-bold">SECP256K1 & RSA-2048</strong>
        </div>
        <div className="p-3 bg-[#110000] border border-white/10 flex justify-between items-center">
          <span className="text-white/60">NIST PQC MANDATE:</span>
          <strong className="text-emerald-400 font-bold">FIPS 203 / 204 COMPLIANT</strong>
        </div>
      </div>
    </div>
  );
};
