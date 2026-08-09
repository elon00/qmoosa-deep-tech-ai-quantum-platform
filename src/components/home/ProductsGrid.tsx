import React from "react";
import { PRODUCTS_LIST } from "../../data/mockData";
import { NavigationTab } from "../../types";
import { Bot, Cpu, Link as LinkIcon, Shield, Layers, FlaskConical, Check, ArrowRight } from "lucide-react";

interface ProductsGridProps {
  setCurrentTab: (tab: NavigationTab) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ setCurrentTab }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Bot":
        return <Bot className="w-5 h-5 text-[#00F0FF]" />;
      case "Cpu":
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case "Link":
        return <LinkIcon className="w-5 h-5 text-purple-400" />;
      case "Shield":
        return <Shield className="w-5 h-5 text-amber-400" />;
      case "FlaskConical":
        return <FlaskConical className="w-5 h-5 text-blue-400" />;
      default:
        return <Layers className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <section className="py-20 bg-[#050505] border-b border-white/10 text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 font-mono-code">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#00F0FF]">
            // QMoosa Platform Products
          </h2>
          <p className="mt-3 text-3xl sm:text-5xl font-display font-light text-white tracking-tight">
            Integrated Next-Gen Software Suite
          </p>
          <p className="mt-4 text-neutral-400 text-xs uppercase tracking-widest font-sans">
            Modular, enterprise-ready software products built on deep-tech foundations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS_LIST.map((prod) => (
            <div
              key={prod.id}
              className="border border-white/10 bg-white/[0.02] p-6 hover:border-white/30 transition duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 border border-white/10 bg-black">
                    {getIcon(prod.iconName)}
                  </div>
                  <span className="text-[9px] font-mono-code uppercase px-2 py-0.5 border border-white/20 text-[#00F0FF]">
                    {prod.status}
                  </span>
                </div>

                <span className="text-[10px] font-mono-code text-[#00F0FF] uppercase tracking-widest font-bold">
                  {prod.category}
                </span>
                <h3 className="text-2xl font-display font-light text-white mt-1 group-hover:text-[#00F0FF] transition-colors">
                  {prod.name}
                </h3>
                <p className="text-xs font-mono-code text-neutral-400 mt-0.5">{prod.tagline}</p>

                <p className="text-neutral-300 text-xs mt-3 leading-relaxed font-sans">{prod.description}</p>

                <div className="mt-5 space-y-2 pt-4 border-t border-white/10">
                  {prod.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-neutral-400 font-sans">
                      <Check className="w-3.5 h-3.5 text-[#00FF41] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => setCurrentTab("ai-workspace")}
                  className="w-full py-2.5 px-4 text-xs font-mono-code uppercase tracking-widest bg-black hover:bg-white hover:text-black text-white border border-white/20 transition duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Explore {prod.name}</span>
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
