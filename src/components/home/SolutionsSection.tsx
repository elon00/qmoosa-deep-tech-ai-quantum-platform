import React from "react";
import { SOLUTIONS_LIST } from "../../data/mockData";
import { NavigationTab } from "../../types";
import { Rocket, Building2, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";

interface SolutionsSectionProps {
  setCurrentTab: (tab: NavigationTab) => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({ setCurrentTab }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Rocket":
        return <Rocket className="w-5 h-5 text-[#00F0FF]" />;
      case "Building2":
        return <Building2 className="w-5 h-5 text-cyan-400" />;
      default:
        return <GraduationCap className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section className="py-20 bg-[#050505] border-b border-white/10 text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 font-mono-code">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#00F0FF]">
            // Tailored Industry Solutions
          </h2>
          <p className="mt-3 text-3xl sm:text-5xl font-display font-light text-white tracking-tight">
            Architected for Technical Scale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SOLUTIONS_LIST.map((sol) => (
            <div
              key={sol.id}
              className="border border-white/10 bg-white/[0.02] p-8 hover:border-white/30 transition flex flex-col justify-between"
            >
              <div>
                <div className="p-3 border border-white/10 bg-black w-fit mb-6">
                  {getIcon(sol.iconName)}
                </div>
                <span className="text-[10px] font-mono-code text-[#00F0FF] uppercase tracking-widest font-bold">
                  {sol.targetAudience}
                </span>
                <h3 className="text-2xl font-display font-light text-white mt-1 leading-snug">{sol.headline}</h3>
                <p className="text-neutral-300 text-xs mt-3 leading-relaxed font-sans">{sol.description}</p>

                <div className="mt-6 space-y-2.5 pt-4 border-t border-white/10 font-sans">
                  {sol.benefits.map((ben, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF41] shrink-0" />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => setCurrentTab("contact")}
                  className="w-full py-3 text-xs font-mono-code uppercase tracking-widest bg-black hover:bg-white hover:text-black text-white border border-white/20 transition flex items-center justify-center space-x-2"
                >
                  <span>Request Consultation</span>
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
