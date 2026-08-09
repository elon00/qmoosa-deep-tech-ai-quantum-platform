import React from "react";
import { TESTIMONIALS_LIST } from "../../data/mockData";
import { ShieldCheck, Quote } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#050505] border-b border-white/10 text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 font-mono-code">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/[0.03] text-[#00FF41] border border-white/10 text-[10px] uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VERIFIED CLIENT REVIEWS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-light text-white tracking-tight">
            Trusted by Deep-Tech Leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_LIST.map((test) => (
            <div
              key={test.id}
              className="border border-white/10 bg-white/[0.02] p-6 relative flex flex-col justify-between hover:border-white/30 transition"
            >
              <Quote className="w-8 h-8 text-white/10 absolute top-4 right-4" />

              <div className="relative z-10">
                <p className="text-xs text-neutral-300 italic font-display leading-relaxed text-sm">
                  "{test.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono-code">
                <div className="flex items-center space-x-3">
                  <img
                    src={test.avatarUrl}
                    alt={test.clientName}
                    className="w-10 h-10 object-cover border border-white/20 grayscale"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{test.clientName}</h4>
                    <p className="text-[9px] text-neutral-400">{test.role}</p>
                    <p className="text-[9px] text-[#00F0FF] uppercase">{test.company}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center space-x-1 text-[9px] text-[#00FF41] bg-black px-2 py-0.5 border border-white/10 uppercase">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{test.verificationStatus}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
