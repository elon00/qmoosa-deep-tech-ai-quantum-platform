import React, { useState } from 'react';
import { Sparkles, Code, ShieldAlert, CheckCircle2, ArrowRight, AlertTriangle, Terminal, Copy, Check, BookOpen, FileCheck, Award, Printer, Download, FileText, ChevronRight, CheckSquare, Square, ShieldCheck } from 'lucide-react';
import { SecurityAuditResult } from '../types';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  standardRef: string;
  completed: boolean;
}

export const AiMigrationAudit: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'guidebook' | 'checklist' | 'report'>('audit');

  const [snippet, setSnippet] = useState(
`// Legacy TLS / Crypto Config Example
const tlsOptions = {
  minVersion: 'TLSv1.2',
  ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384',
  keyExchange: 'Secp256r1', // Vulnerable to Shor's algorithm
  rsaKeySize: 2048
};`
  );
  const [systemName, setSystemName] = useState('Production Microservice Infrastructure');
  const [auditorName, setAuditorName] = useState('Dr. Alex Mercer, CISSP / CISA');
  const [auditorOrg, setAuditorOrg] = useState('QuantumShield PQC Compliance Services');
  const [auditorId, setAuditorId] = useState('AUD-PQC-2026-8841');
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Auditor Guidebook Checklist State
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'chk-1',
      category: 'Phase 1: Discovery & Inventory',
      title: 'Automated Cryptographic Inventory Scan',
      description: 'Catalog all asymmetric algorithms (RSA, ECDSA, ECDH) across internal endpoints, TLS proxies, and databases.',
      standardRef: 'NIST SP 800-215 / FIPS 203 Prep',
      completed: true
    },
    {
      id: 'chk-2',
      category: 'Phase 1: Discovery & Inventory',
      title: 'Identify Store-Now-Decrypt-Later (SNDL) Vulnerable Data',
      description: 'Flag encrypted data in transit with retention sensitivity > 5 years vulnerable to quantum interception.',
      standardRef: 'CNSA 2.0 Timeline Mandate',
      completed: true
    },
    {
      id: 'chk-3',
      category: 'Phase 2: Risk Scoring & Threat Analysis',
      title: 'Shor Algorithm Impact Analysis on Key Exchange',
      description: 'Audit Diffie-Hellman / ECDH curves for polynomial-time quantum period-finding vulnerability.',
      standardRef: 'NIST FIPS 203 Section 3',
      completed: true
    },
    {
      id: 'chk-[#4]',
      category: 'Phase 2: Risk Scoring & Threat Analysis',
      title: 'Public Key Exposure Verification',
      description: 'Check whether public keys are exposed on-chain or in unencrypted headers before transaction broadcast.',
      standardRef: 'ECDSA Secp256k1 Security Spec',
      completed: false
    },
    {
      id: 'chk-[#5]',
      category: 'Phase 3: Hybrid Key Exchange Implementation',
      title: 'Deploy Hybrid Dual-Algorithm Key Exchange',
      description: 'Implement dual-key derivation (e.g. X25519 + ML-KEM-768 via HKDF-SHA256) to maintain FIPS 140-3 fallback.',
      standardRef: 'NIST FIPS 203 / OpenSSL 3.4 Spec',
      completed: true
    },
    {
      id: 'chk-[#6]',
      category: 'Phase 3: Hybrid Key Exchange Implementation',
      title: 'Verify Ciphertext Overhead & MTU Limits',
      description: 'Ensure network stack handles ML-KEM-768 key encapsulation size (1,088-byte public key, 1,088-byte ciphertext) without packet fragmentation.',
      standardRef: 'IETF PQC-TLS Draft',
      completed: false
    },
    {
      id: 'chk-[#7]',
      category: 'Phase 4: Digital Signature Migration',
      title: 'Upgrade Code Signing to ML-DSA (FIPS 204)',
      description: 'Transition software signing pipelines from RSA-3072 / ECDSA to ML-DSA-65 lattice-based signatures.',
      standardRef: 'NIST FIPS 204 Standard',
      completed: false
    },
    {
      id: 'chk-[#8]',
      category: 'Phase 5: Agility & Policy',
      title: 'Establish Cryptographic Agility & Key Rotation Policy',
      description: 'Configure automated hot-swappable cipher suites without requiring source code re-compilation.',
      standardRef: 'ISO/IEC 19790 / CNSA 2.0',
      completed: true
    }
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handleRunAudit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/crypto-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeOrConfig: snippet, systemName })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || 'Audit request failed');
      }

      const data: SecurityAuditResult = await res.json();
      setAuditResult(data);
    } catch (err: any) {
      alert(`AI Cryptographic Audit Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const completedCount = checklist.filter(c => c.completed).length;
  const checklistCompliancePct = Math.round((completedCount / checklist.length) * 100);

  const handleDownloadReport = () => {
    const reportTxt = `================================================================================
QUANTUMSHIELD PQC COMPLIANCE & AUDIT REPORT
Official Post-Quantum Cryptography Audit Certificate
================================================================================
DATE: ${new Date().toUTCString()}
AUDITOR: ${auditorName} (${auditorOrg})
AUDITOR ID: ${auditorId}
TARGET SYSTEM: ${systemName}

1. EXECUTIVE COMPLIANCE SUMMARY:
--------------------------------------------------------------------------------
Audit Mode: NIST FIPS 203 (ML-KEM) & CNSA 2.0 Compliance Audit
Checklist Compliance Score: ${checklistCompliancePct}% (${completedCount} / ${checklist.length} Passed)
Overall Quantum Risk Rating: ${auditResult ? auditResult.riskLevel : 'EVALUATED'}
AI Quantum Risk Score: ${auditResult ? auditResult.overallRiskScore + '/100' : 'N/A'}

2. AI CRYPTOGRAPHIC RISK ASSESSMENT:
--------------------------------------------------------------------------------
${auditResult ? auditResult.summary : 'Full AI analysis run on target cipher configuration.'}

3. IDENTIFIED VULNERABILITIES:
--------------------------------------------------------------------------------
${auditResult && auditResult.vulnerabilities ? auditResult.vulnerabilities.map((v, i) => `${i+1}. [${v.affectedStandard}] ${v.title}\n   ${v.description}`).join('\n\n') : 'No active vulnerabilities reported.'}

4. MIGRATION ROADMAP & ACTION ITEMS:
--------------------------------------------------------------------------------
${auditResult && auditResult.recommendations ? auditResult.recommendations.map((r, i) => `${i+1}. [${r.targetTarget || r.targetStandard}] ${r.action}\n   ${r.details}`).join('\n\n') : 'Follow NIST FIPS 203 ML-KEM-768 hybrid guidelines.'}

5. AUDITOR CHECKLIST VERIFICATION LOGS:
--------------------------------------------------------------------------------
${checklist.map(c => `[${c.completed ? 'PASS' : 'FAIL'}] ${c.category} - ${c.title} (${c.standardRef})`).join('\n')}

================================================================================
VERIFICATION SEAL: QUANTUMSHIELD-PQC-AUDIT-VALIDATED
================================================================================`;

    const blob = new Blob([reportTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuantumShield_Audit_Report_${systemName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111111] border-l-4 border-[#FF003C] p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#FF003C] text-white font-bold shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-mono font-bold bg-[#FF003C] text-white px-2.5 py-1 uppercase tracking-widest">
                  GEMINI AI & AUDITOR WORKSTATION
                </span>
                <span className="text-xs font-mono text-white/50 uppercase tracking-widest">PQC AUDITOR GUIDEBOOK & COMPLIANCE MANUAL</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                AI QUANTUM RISK & AUDITOR COMPLIANCE SUITE
              </h2>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
                Audit application cipher suites, run automated NIST FIPS 203/204/205 compliance checks, inspect the official PQC Auditor Manual, and export formal auditor certificates.
              </p>
            </div>
          </div>

          {/* Sub-navigation Tabs */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0 font-mono text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('audit')}
              className={`px-4 py-2 border uppercase flex items-center gap-2 cursor-pointer transition-all ${
                activeSubTab === 'audit'
                  ? 'bg-white text-black border-white'
                  : 'bg-[#050505] text-white/70 border-white/20 hover:border-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#FF003C]" />
              <span>01 // AI CIPHER AUDIT</span>
            </button>

            <button
              onClick={() => setActiveSubTab('checklist')}
              className={`px-4 py-2 border uppercase flex items-center gap-2 cursor-pointer transition-all ${
                activeSubTab === 'checklist'
                  ? 'bg-emerald-400 text-black border-emerald-400 font-black'
                  : 'bg-[#050505] text-white/70 border-white/20 hover:border-white'
              }`}
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>02 // AUDITOR CHECKLIST</span>
            </button>

            <button
              onClick={() => setActiveSubTab('guidebook')}
              className={`px-4 py-2 border uppercase flex items-center gap-2 cursor-pointer transition-all ${
                activeSubTab === 'guidebook'
                  ? 'bg-cyan-400 text-black border-cyan-400 font-black'
                  : 'bg-[#050505] text-white/70 border-white/20 hover:border-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>03 // PQC GUIDEBOOK MANUAL</span>
            </button>

            <button
              onClick={() => setActiveSubTab('report')}
              className={`px-4 py-2 border uppercase flex items-center gap-2 cursor-pointer transition-all ${
                activeSubTab === 'report'
                  ? 'bg-amber-400 text-black border-amber-400 font-black'
                  : 'bg-[#050505] text-white/70 border-white/20 hover:border-white'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>04 // AUDIT REPORT CERTIFICATE</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: AI CIPHER AUDIT */}
      {activeSubTab === 'audit' && (
        <div className="space-y-6">
          {/* Input Section */}
          <div className="bg-[#111111] border border-white/10 p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60">SYSTEM / PROJECT NAME:</label>
                <input
                  type="text"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  className="w-full bg-[#050505] border border-white/20 px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-[#FF003C]"
                  placeholder="e.g. Payments Gateway"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60">PRESET QUICK TEMPLATES:</label>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setSnippet(`// Legacy Node.js HTTPS Server Config\nconst options = {\n  key: fs.readFileSync('rsa_private.pem'),\n  cert: fs.readFileSync('rsa_cert.pem'),\n  ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384',\n  honorCipherOrder: true\n};`)}
                    className="px-3 py-2 bg-[#050505] border border-white/20 hover:border-white text-white/80 hover:text-white font-bold cursor-pointer transition-colors text-[11px] uppercase tracking-wider"
                  >
                    NODE.JS RSA TLS
                  </button>
                  <button
                    type="button"
                    onClick={() => setSnippet(`// OpenSSL 3.0 / Nginx SSL Cipher Suite\nssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';\nssl_ecdh_curve secp384r1:prime256v1;`)}
                    className="px-3 py-2 bg-[#050505] border border-white/20 hover:border-white text-white/80 hover:text-white font-bold cursor-pointer transition-colors text-[11px] uppercase tracking-wider"
                  >
                    NGINX ECDHE CIPHER
                  </button>
                  <button
                    type="button"
                    onClick={() => setSnippet(`// OpenSSL 3.4 Hybrid Post-Quantum TLS Config\nssl_protocols TLSv1.3;\nssl_conf_command Groups X25519MLKEM768:X25519:Secp256r1;`)}
                    className="px-3 py-2 bg-[#050505] border border-white/20 hover:border-white text-white/80 hover:text-white font-bold cursor-pointer transition-colors text-[11px] uppercase tracking-wider"
                  >
                    OPENSSL 3.4 PQC HYBRID
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60">CODE / CONFIG SNIPPET TO AUDIT:</label>
              <textarea
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
                rows={6}
                className="w-full bg-[#050505] border border-white/20 p-4 text-xs font-mono text-white focus:outline-none focus:border-[#FF003C]"
              />
            </div>

            <button
              onClick={handleRunAudit}
              disabled={isLoading || !snippet.trim()}
              className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-[#FF003C] text-black hover:text-white font-black text-xs uppercase tracking-widest cursor-pointer transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin" />
                  <span>ANALYZING QUANTUM RISK WITH GEMINI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>PERFORM AI QUANTUM AUDIT</span>
                </>
              )}
            </button>
          </div>

          {/* Audit Output Results */}
          {auditResult && (
            <div className="space-y-6">
              {/* Summary Score Card */}
              <div className="bg-[#111111] border border-white/10 p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div className="text-center p-6 bg-[#050505] border-2 border-white/20">
                  <span className="text-[10px] text-white/50 uppercase font-mono tracking-widest block">QUANTUM RISK SCORE</span>
                  <span className={`text-5xl font-black font-mono mt-2 block ${
                    auditResult.overallRiskScore > 70 ? 'text-[#FF003C]' :
                    auditResult.overallRiskScore > 40 ? 'text-amber-400' : 'text-[#00FF41]'
                  }`}>
                    {auditResult.overallRiskScore}<span className="text-xl font-light text-white/40">/100</span>
                  </span>
                  <span className={`inline-block mt-3 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest ${
                    auditResult.riskLevel === 'CRITICAL' ? 'bg-[#FF003C] text-white' :
                    auditResult.riskLevel === 'HIGH' ? 'bg-amber-400 text-black' : 'bg-[#00FF41] text-black'
                  }`}>
                    {auditResult.riskLevel}
                  </span>
                </div>

                <div className="md:col-span-3 space-y-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">EXECUTIVE ASSESSMENT</h3>
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#050505] p-5 border border-white/10 font-sans">
                    {auditResult.summary}
                  </p>
                </div>
              </div>

              {/* Vulnerabilities List */}
              {auditResult.vulnerabilities && auditResult.vulnerabilities.length > 0 && (
                <div className="bg-[#111111] border-2 border-[#FF003C] p-6 space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-[#FF003C]" />
                    <span>IDENTIFIED CRYPTOGRAPHIC VULNERABILITIES</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4 font-mono text-xs">
                    {auditResult.vulnerabilities.map((vuln, idx) => (
                      <div key={idx} className="bg-[#050505] p-4 border border-[#FF003C]/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#FF003C] uppercase tracking-wider">{vuln.title}</span>
                          <span className="px-2.5 py-1 text-[10px] bg-[#FF003C] text-white font-bold uppercase tracking-widest">
                            {vuln.affectedStandard}
                          </span>
                        </div>
                        <p className="text-slate-300 font-sans text-xs">{vuln.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations with Code Snippets */}
              {auditResult.recommendations && auditResult.recommendations.length > 0 && (
                <div className="bg-[#111111] border-2 border-[#00FF41] p-6 space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00FF41]" />
                    <span>NIST PQC MIGRATION ACTION PLAN</span>
                  </h3>
                  <div className="space-y-4 font-mono text-xs">
                    {auditResult.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-[#050505] p-5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#00FF41] text-xs uppercase tracking-wider">{rec.action}</span>
                          <span className="px-2.5 py-1 text-[10px] bg-[#00FF41] text-black font-bold uppercase tracking-widest">
                            {rec.targetStandard}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans">{rec.details}</p>

                        {rec.codeSnippet && (
                          <div className="relative mt-2">
                            <div className="flex justify-between items-center bg-[#111111] px-4 py-2 border-t border-x border-white/20 text-[10px] font-mono text-white/60 uppercase tracking-widest">
                              <span>TARGET PQC CONFIGURATION CODE:</span>
                              <button
                                onClick={() => handleCopyCode(rec.codeSnippet!, idx)}
                                className="flex items-center gap-1.5 text-white hover:text-[#00FF41] font-bold cursor-pointer"
                              >
                                {copiedIndex === idx ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#00FF41]" />
                                    <span className="text-[#00FF41]">COPIED</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>COPY CODE</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="bg-[#050505] p-4 border border-white/20 text-[11px] font-mono text-[#00FF41] overflow-x-auto">
                              {rec.codeSnippet}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: AUDITOR CHECKLIST */}
      {activeSubTab === 'checklist' && (
        <div className="bg-[#111111] border border-emerald-500/50 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 gap-4 font-mono">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">AUDITOR STANDARD OPERATING PROCEDURE</span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-emerald-400" />
                <span>NIST PQC MIGRATION AUDIT CHECKLIST</span>
              </h3>
            </div>
            <div className="bg-[#050505] p-3 border border-emerald-500/40 text-center shrink-0">
              <span className="text-[9px] text-white/50 block uppercase">COMPLIANCE PROGRESS</span>
              <span className="text-2xl font-black text-emerald-400">{checklistCompliancePct}%</span>
              <span className="text-[10px] text-white/70 block">({completedCount} / {checklist.length} Passed)</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            As a certified cryptographic auditor, complete each verification phase in sequence to ensure total system readiness against Shor's algorithm and Store-Now-Decrypt-Later (SNDL) threats:
          </p>

          <div className="space-y-3 font-mono text-xs">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-4 border cursor-pointer transition-all flex items-start gap-3.5 ${
                  item.completed
                    ? 'bg-emerald-950/20 border-emerald-500/60 text-white'
                    : 'bg-[#050505] border-white/20 hover:border-white/50 text-white/70'
                }`}
              >
                <button className="mt-0.5 text-emerald-400 shrink-0">
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-white/40" />
                  )}
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-black border border-white/20 text-emerald-400 font-bold">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-white/50 font-bold">
                      {item.standardRef}
                    </span>
                  </div>
                  <h4 className={`font-bold text-sm ${item.completed ? 'text-emerald-300 line-through' : 'text-white'}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PQC GUIDEBOOK MANUAL */}
      {activeSubTab === 'guidebook' && (
        <div className="bg-[#111111] border border-cyan-500/50 p-6 space-y-6 font-mono text-xs">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">OFFICIAL AUDITOR MANUAL</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-400" />
              <span>NIST FIPS 203 / 204 / 205 AUDITOR GUIDEBOOK</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#050505] p-5 border border-cyan-500/40 space-y-3">
              <span className="px-2 py-0.5 bg-cyan-400 text-black font-black text-[10px] uppercase">FIPS 203 STANDARD</span>
              <h4 className="text-base font-black text-white">ML-KEM (Crystals-Kyber)</h4>
              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                Primary post-quantum key encapsulation mechanism (KEM) based on Module Learning With Errors (M-LWE).
              </p>
              <div className="text-[11px] text-cyan-300 space-y-1 border-t border-white/10 pt-2">
                <div>• ML-KEM-512 (NIST Level 1 / AES-128)</div>
                <div>• ML-KEM-768 (NIST Level 3 / AES-192) ★ RECOMMENDED</div>
                <div>• ML-KEM-1024 (NIST Level 5 / AES-256)</div>
              </div>
            </div>

            <div className="bg-[#050505] p-5 border border-purple-500/40 space-y-3">
              <span className="px-2 py-0.5 bg-purple-400 text-black font-black text-[10px] uppercase">FIPS 204 STANDARD</span>
              <h4 className="text-base font-black text-white">ML-DSA (Crystals-Dilithium)</h4>
              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                Lattice-based digital signature algorithm for authentication, PKI certificates, and code signing.
              </p>
              <div className="text-[11px] text-purple-300 space-y-1 border-t border-white/10 pt-2">
                <div>• ML-DSA-44 (NIST Level 2)</div>
                <div>• ML-DSA-65 (NIST Level 3) ★ RECOMMENDED</div>
                <div>• ML-DSA-87 (NIST Level 5)</div>
              </div>
            </div>

            <div className="bg-[#050505] p-5 border border-amber-500/40 space-y-3">
              <span className="px-2 py-0.5 bg-amber-400 text-black font-black text-[10px] uppercase">FIPS 205 STANDARD</span>
              <h4 className="text-base font-black text-white">SLH-DSA (SPHINCS+)</h4>
              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                Stateless hash-based digital signature algorithm providing conservative fallback security independent of lattice assumptions.
              </p>
              <div className="text-[11px] text-amber-300 space-y-1 border-t border-white/10 pt-2">
                <div>• SLH-DSA-SHA2-128f / 128s</div>
                <div>• SLH-DSA-SHAKE-192f / 192s</div>
                <div>• SLH-DSA-SHAKE-256f / 256s</div>
              </div>
            </div>
          </div>

          <div className="bg-[#050505] p-5 border border-white/20 space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider text-amber-400">
              CNSA 2.0 TIMELINE MANDATES (US NATIONAL SECURITY SYSTEMS)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
              <div className="p-3 bg-[#111111] border border-white/10">
                <span className="text-amber-400 font-bold block">2025 TRANSITION</span>
                <span className="text-white/70">Adopt PQC software & firmware signing.</span>
              </div>
              <div className="p-3 bg-[#111111] border border-white/10">
                <span className="text-amber-400 font-bold block">2026 MANDATE</span>
                <span className="text-white/70">Mandatory support for ML-KEM-768 in web proxies & VPNs.</span>
              </div>
              <div className="p-3 bg-[#111111] border border-white/10">
                <span className="text-amber-400 font-bold block">2030 HARD CUTOFF</span>
                <span className="text-white/70">Deprecate RSA-2048/3072, ECC, and DH completely.</span>
              </div>
              <div className="p-3 bg-[#111111] border border-white/10">
                <span className="text-emerald-400 font-bold block">2033 FINAL GOAL</span>
                <span className="text-white/70">100% PQC-only across all defense & enterprise networks.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: AUDIT REPORT CERTIFICATE */}
      {activeSubTab === 'report' && (
        <div className="bg-[#111111] border-2 border-amber-400/60 p-6 sm:p-8 space-y-6 font-mono text-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-amber-400/40 pb-4 gap-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">FORMAL AUDITOR CERTIFICATE</span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <span>OFFICIAL COMPLIANCE AUDIT CERTIFICATE</span>
              </h3>
            </div>
            <button
              onClick={handleDownloadReport}
              className="px-5 py-3 bg-amber-400 hover:bg-white text-black font-black uppercase text-xs tracking-wider cursor-pointer transition-colors flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT AUDIT REPORT</span>
            </button>
          </div>

          {/* Form Inputs for Auditor Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#050505] p-4 border border-white/10">
            <div>
              <label className="text-[9px] text-white/50 uppercase font-bold block mb-1">AUDITOR NAME & TITLE:</label>
              <input
                type="text"
                value={auditorName}
                onChange={(e) => setAuditorName(e.target.value)}
                className="w-full bg-[#111111] border border-white/20 p-2 text-white font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-white/50 uppercase font-bold block mb-1">AUDIT ORGANIZATION:</label>
              <input
                type="text"
                value={auditorOrg}
                onChange={(e) => setAuditorOrg(e.target.value)}
                className="w-full bg-[#111111] border border-white/20 p-2 text-white font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-white/50 uppercase font-bold block mb-1">AUDITOR REGISTRATION ID:</label>
              <input
                type="text"
                value={auditorId}
                onChange={(e) => setAuditorId(e.target.value)}
                className="w-full bg-[#111111] border border-white/20 p-2 text-white font-mono text-xs"
              />
            </div>
          </div>

          {/* Printable Certificate Frame */}
          <div className="bg-[#050505] border-4 border-amber-400/80 p-8 space-y-6 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-3 left-3 text-[10px] text-amber-400 font-mono tracking-widest uppercase">
              CONFIDENTIAL AUDIT SEAL // NIST FIPS 203
            </div>
            <div className="absolute bottom-3 right-3 text-[10px] text-amber-400 font-mono tracking-widest uppercase">
              ID: {auditorId}
            </div>

            <div className="space-y-2 pt-4">
              <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
              <h2 className="text-2xl font-black uppercase text-white tracking-widest">
                CERTIFICATE OF PQC COMPLIANCE AUDIT
              </h2>
              <p className="text-xs text-white/60 uppercase tracking-wider font-mono">
                ISSUED BY {auditorOrg.toUpperCase()}
              </p>
            </div>

            <div className="border-y border-amber-400/40 py-6 my-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div>
                <span className="text-[9px] text-amber-400 block font-bold">TARGET SYSTEM AUDITED:</span>
                <strong className="text-white text-sm font-bold block">{systemName}</strong>
              </div>
              <div>
                <span className="text-[9px] text-amber-400 block font-bold">CHECKLIST COMPLIANCE:</span>
                <strong className="text-emerald-400 text-sm font-bold block">{checklistCompliancePct}% ({completedCount}/{checklist.length} Passed)</strong>
              </div>
              <div>
                <span className="text-[9px] text-amber-400 block font-bold">QUALIFIED AUDITOR:</span>
                <strong className="text-white text-sm font-bold block">{auditorName}</strong>
              </div>
            </div>

            <div className="space-y-2 text-left bg-[#111111] p-4 border border-white/10">
              <span className="text-[10px] text-white/50 block font-bold uppercase">AUDITOR EXECUTIVE ATTESTATION:</span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                This document certifies that the target system "{systemName}" has undergone a formal Post-Quantum Cryptographic Audit in accordance with NIST FIPS 203 (ML-KEM) and CNSA 2.0 standards under Auditor ID {auditorId}.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-white/50 font-mono border-t border-white/10">
              <span>DATE OF AUDIT: {new Date().toUTCString()}</span>
              <span className="text-amber-400 font-bold">STATUS: VERIFIED & COMPLIANT WITH PQC AUDIT PROTOCOLS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

