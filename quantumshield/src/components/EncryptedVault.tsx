import React, { useState, useEffect } from 'react';
import { Lock, History, Database, ShieldCheck, Download, Trash2, Filter } from 'lucide-react';
import { fetchRecentSessionLogs } from '../lib/firebase';
import { LogEntry } from '../types';

interface EncryptedVaultProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const EncryptedVault: React.FC<EncryptedVaultProps> = ({ logs, onClearLogs }) => {
  const [firestoreLogs, setFirestoreLogs] = useState<any[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const loadDbLogs = async () => {
    setIsLoadingDb(true);
    try {
      const data = await fetchRecentSessionLogs(15);
      setFirestoreLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    loadDbLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filterType === 'all') return true;
    return log.source === filterType || log.type === filterType;
  });

  const handleExportAuditReport = () => {
    const reportContent = {
      title: "QuantumShield PQC Audit Log Report",
      exportedAt: new Date().toISOString(),
      protocol: "Hybrid X25519 + ML-KEM-768 (Crystals-Kyber)",
      standard: "NIST FIPS 203 Compliant",
      localLogsCount: logs.length,
      firestoreLogsCount: firestoreLogs.length,
      logs
    };

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantumshield_pqc_audit_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border-l-4 border-[#FF003C] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#FF003C] text-xs font-mono font-bold uppercase tracking-[0.2em]">
            <Lock className="w-4 h-4 text-[#FF003C]" />
            <span>ENCRYPTED VAULT & SESSION STORAGE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            HANDSHAKE AUDIT TRAIL & FIRESTORE RECORDS
          </h2>
          <p className="text-xs text-white/60 font-sans max-w-3xl">
            Tracks cryptographic session setup events, HKDF key derivations, and cloud-synced security records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportAuditReport}
            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-[#00FF41] text-black font-black text-xs uppercase tracking-widest cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT AUDIT REPORT (JSON)</span>
          </button>

          <button
            onClick={onClearLogs}
            className="p-3 bg-[#050505] border border-white/20 hover:border-[#FF003C] hover:text-[#FF003C] text-white/60 cursor-pointer transition-colors"
            title="Clear live session logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Handshake Console Logs */}
        <div className="bg-[#111111] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-white" />
              <h3 className="text-base font-black text-white uppercase tracking-tight">LIVE EXECUTION LOGS</h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <Filter className="w-3.5 h-3.5 text-white/40" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#050505] border border-white/20 text-white text-xs px-2 py-1 font-mono uppercase focus:outline-none focus:border-[#FF003C]"
              >
                <option value="all">ALL SOURCES</option>
                <option value="client">CLIENT ONLY</option>
                <option value="server">SERVER ONLY</option>
                <option value="success">SUCCESS ONLY</option>
              </select>
            </div>
          </div>

          <div className="bg-[#050505] p-4 h-80 overflow-y-auto space-y-2 font-mono text-xs border border-white/10">
            {filteredLogs.length === 0 ? (
              <p className="text-white/30 italic text-center py-12 uppercase tracking-widest text-[11px]">No live execution logs recorded yet. Run a handshake in Sandbox.</p>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="border-b border-white/5 pb-2 text-[11px] leading-relaxed">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-white/40">{log.timestamp}</span>
                    <span className={`px-2 py-0.5 font-bold uppercase tracking-widest text-[9px] ${
                      log.source === 'client' ? 'bg-white text-black' :
                      log.source === 'server' ? 'bg-[#FF003C] text-white' : 'bg-amber-400 text-black'
                    }`}>
                      {log.source}
                    </span>
                  </div>
                  <p className={`mt-1 font-mono ${
                    log.type === 'error' ? 'text-[#FF003C] font-bold' :
                    log.type === 'success' ? 'text-[#00FF41] font-bold' : 'text-slate-300'
                  }`}>
                    {log.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Firebase Firestore Cloud Logs */}
        <div className="bg-[#111111] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#00FF41]" />
              <h3 className="text-base font-black text-white uppercase tracking-tight">CLOUD FIRESTORE RECORDS</h3>
            </div>
            <button
              onClick={loadDbLogs}
              disabled={isLoadingDb}
              className="text-xs font-mono font-bold text-[#00FF41] hover:underline cursor-pointer uppercase tracking-widest"
            >
              {isLoadingDb ? 'LOADING...' : 'REFRESH DB'}
            </button>
          </div>

          <div className="bg-[#050505] p-4 h-80 overflow-y-auto space-y-3 font-mono text-xs border border-white/10">
            {firestoreLogs.length === 0 ? (
              <p className="text-white/30 italic text-center py-12 uppercase tracking-widest text-[11px]">No persistent Firestore sessions found yet.</p>
            ) : (
              firestoreLogs.map((doc, idx) => (
                <div key={doc.id || idx} className="bg-[#111111] p-4 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                    <span className="text-[#00FF41] font-bold uppercase">SESSION ID: {doc.id.substring(0, 8)}...</span>
                    <span>{doc.createdAt ? new Date(doc.createdAt).toLocaleTimeString() : 'JUST NOW'}</span>
                  </div>
                  <div className="text-[11px] text-white/80 break-all font-mono">
                    <span className="text-white/40">CLIENT X25519 PUB:</span> {doc.clientPublicX25519 || 'N/A'}
                  </div>
                  <div className="text-[11px] text-white/80 break-all font-mono">
                    <span className="text-white/40">DERIVED HKDF KEY PREFIX:</span> <span className="text-[#00FF41] font-bold">{doc.derivedKeyHex || 'N/A'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
