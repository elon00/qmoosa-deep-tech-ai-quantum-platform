import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export const ProjectConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    country: "United States",
    projectType: "AI Agentic Systems",
    budget: "$50k - $150k",
    timeline: "1 - 3 Months",
    message: "",
    ndaRequired: true,
    agreedPrivacy: true,
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<{ leadId: string; message: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      setErrorMsg("Please fill in all required fields marked with *.");
      return;
    }

    if (!formData.agreedPrivacy) {
      setErrorMsg("Please accept the Privacy Policy to proceed.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessResult({ leadId: data.leadId, message: data.message });
      } else {
        setErrorMsg(data.error || "Submission failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-[#050505] border-b border-white/10 text-[#F5F5F5]" id="contact-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 font-mono-code">
          <span className="text-xs uppercase tracking-[0.25em] text-[#00F0FF]">
            // START A PROJECT / CONSULTATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-light text-white tracking-tight mt-2">
            Build Your Deep-Tech Breakthrough
          </h2>
          <p className="mt-3 text-neutral-400 text-xs uppercase tracking-widest font-sans">
            Our principal AI, Quantum, and Cryptographic architects respond within 24 hours.
          </p>
        </div>

        {successResult ? (
          <div className="border border-[#00FF41]/40 bg-black p-8 text-center space-y-4 font-mono-code">
            <CheckCircle2 className="w-12 h-12 text-[#00FF41] mx-auto" />
            <h3 className="text-3xl font-display font-light text-white">Project Request Submitted</h3>
            <p className="text-xs text-neutral-300 font-sans">{successResult.message}</p>
            <div className="inline-block bg-white/5 px-4 py-2 border border-white/10 text-xs text-[#00F0FF]">
              Reference Lead ID: {successResult.leadId}
            </div>
            <div className="pt-4">
              <button
                onClick={() => setSuccessResult(null)}
                className="px-6 py-2.5 text-xs uppercase tracking-widest bg-white text-black font-bold hover:bg-[#00F0FF]"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="border border-white/10 bg-white/[0.02] p-6 sm:p-10 space-y-6 font-mono-code"
          >
            {errorMsg && (
              <div className="p-3.5 border border-red-500/50 bg-red-950/40 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-bold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Alan Turing"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F0FF] font-sans"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-bold mb-2">
                  Company / Institution *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Q-Lab Systems"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F0FF] font-sans"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-bold mb-2">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alan@q-lab.io"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F0FF] font-sans"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-bold mb-2">
                  Country
                </label>

                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F0FF] font-sans"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Japan">Japan</option>
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-bold mb-2">
                  Project Domain *
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F0FF] font-sans"
                >
                  <option value="AI Agentic Systems">AI Agentic Systems</option>
                  <option value="Quantum Software & Simulation">Quantum Software & Simulation</option>
                  <option value="Solana & EVM Web3 Infrastructure">Solana & EVM Web3 Infrastructure</option>
                  <option value="Post-Quantum Cryptography Migration">Post-Quantum Cryptography Migration</option>
                  <option value="Web4 Autonomous Agent Economy">Web4 Autonomous Agent Economy</option>
                  <option value="Custom Deep-Tech Development">Custom Deep-Tech Development</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-bold mb-2">
                  Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F0FF] font-sans"
                >
                  <option value="< $25k">&lt; $25,000</option>
                  <option value="$25k - $50k">$25,000 - $50,000</option>
                  <option value="$50k - $150k">$50,000 - $150,000</option>
                  <option value="$150k+">$150,000+</option>
                  <option value="Enterprise License">Enterprise Licensing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-300 font-bold mb-2">
                Project Description & Requirements *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your technical requirements, goals, target architecture, and hardware/software constraints..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-black border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F0FF] font-sans"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="space-y-2 font-sans text-xs">
                <label className="flex items-center space-x-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.ndaRequired}
                    onChange={(e) => setFormData({ ...formData, ndaRequired: e.target.checked })}
                    className="bg-black border-white/20 text-[#00F0FF] focus:ring-0"
                  />
                  <span>Mutual Non-Disclosure Agreement (NDA) Required</span>
                </label>

                <label className="flex items-center space-x-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedPrivacy}
                    onChange={(e) => setFormData({ ...formData, agreedPrivacy: e.target.checked })}
                    className="bg-black border-white/20 text-[#00F0FF] focus:ring-0"
                  />
                  <span>I agree to QMoosa Privacy & Data Protection Terms</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-[#00F0FF] transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? "Submitting..." : "Submit Project Request"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
