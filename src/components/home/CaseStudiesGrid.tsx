import React from "react";
import { CASE_STUDIES_LIST } from "../../data/mockData";
import { NavigationTab } from "../../types";
import { Building2, ArrowRight } from "lucide-react";

interface CaseStudiesGridProps {
  setCurrentTab: (tab: NavigationTab) => void;
}

export const CaseStudiesGrid: React.FC<CaseStudiesGridProps> = ({ setCurrentTab }) => {
  return (
    <section className="py-20 bg-[#050505] border-b border-white/10 text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 font-mono-code">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#00F0FF]">
            // Case Studies & Deployments
          </h2>
          <p className="mt-3 text-3xl sm:text-5xl font-display font-light text-white tracking-tight">
            Production Deep-Tech Results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CASE_STUDIES_LIST.map((cs) => (
            <div
              key={cs.id}
              className="border border-white/10 bg-white/[0.02] p-8 hover:border-white/30 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono-code text-[#00F0FF] uppercase tracking-wider mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{cs.industry}</span>
                </div>
                <h3 className="text-2xl font-display font-light text-white mb-4">{cs.client}</h3>

                <div className="space-y-3 font-sans text-xs">
                  <div className="bg-black p-4 border border-white/10">
                    <span className="font-mono-code text-neutral-400 uppercase font-bold text-[10px] tracking-widest">
                      CHALLENGE:
                    </span>
                    <p className="text-neutral-300 mt-1">{cs.problem}</p>
                  </div>

                  <div className="bg-black p-4 border border-white/10">
                    <span className="font-mono-code text-[#00F0FF] uppercase font-bold text-[10px] tracking-widest">
                      QMOOSA ARCHITECTURE SOLUTION:
                    </span>
                    <p className="text-neutral-300 mt-1">{cs.solution}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center font-mono-code">
                  {cs.metrics.map((m, idx) => (
                    <div key={idx} className="bg-black p-3 border border-white/10">
                      <div className="text-base font-display font-normal text-[#00F0FF]">{m.value}</div>
                      <div className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5 line-clamp-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={() => setCurrentTab("contact")}
                  className="w-full py-3 text-xs font-mono-code uppercase tracking-widest bg-black hover:bg-white hover:text-black text-white border border-white/20 transition flex items-center justify-center space-x-2"
                >
                  <span>Build Similar Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
