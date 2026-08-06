import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  FolderOpen,
  Download,
  Upload,
  Trash2,
  Clock,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Sparkles,
  Layers,
  Edit2,
  Check,
  Zap,
} from 'lucide-react';
import {
  SavedCircuitDesign,
  getSavedCircuits,
  saveCircuitDesign,
  deleteCircuitDesign,
  downloadCircuitsJson,
  importCircuitsFromJson,
  getAutoSaveMissionCircuit,
  clearAutoSaveMissionCircuit,
} from '../lib/circuitStorage';
import { GatePlacement } from '../lib/quantumEngine';
import { Mission } from '../data/missions';

interface SavedCircuitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMission: Mission;
  currentNumQubits: number;
  currentGates: GatePlacement[];
  onLoadCircuit: (gates: GatePlacement[], numQubits: number, missionId?: number) => void;
  soundEnabled?: boolean;
}

export const SavedCircuitsModal: React.FC<SavedCircuitsModalProps> = ({
  isOpen,
  onClose,
  currentMission,
  currentNumQubits,
  currentGates,
  onLoadCircuit,
}) => {
  const [savedCircuits, setSavedCircuits] = useState<SavedCircuitDesign[]>([]);
  const [saveName, setSaveName] = useState('');
  const [saveNotes, setSaveNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMissionId, setFilterMissionId] = useState<number | 'all'>('all');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  // Editing existing design state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Auto-save check for active mission
  const [autoSaveDraft, setAutoSaveDraft] = useState<{
    numQubits: number;
    gates: GatePlacement[];
    savedAt: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      refreshCircuits();
      checkAutoSave();
      // Pre-fill save name default
      setSaveName(`${currentMission.subtitle}: ${currentMission.title} - Draft`);
    }
  }, [isOpen, currentMission]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshCircuits = () => {
    const list = getSavedCircuits();
    setSavedCircuits(list);
  };

  const checkAutoSave = () => {
    const draft = getAutoSaveMissionCircuit(currentMission.id);
    setAutoSaveDraft(draft);
  };

  const handleSaveCurrent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentGates.length === 0) {
      showToast('Cannot save an empty circuit. Add some gates first!', 'error');
      return;
    }

    const titleToUse = saveName.trim() || `${currentMission.subtitle}: ${currentMission.title}`;
    const newSaved = saveCircuitDesign({
      name: titleToUse,
      missionId: currentMission.id,
      missionTitle: currentMission.title,
      numQubits: currentNumQubits,
      gates: currentGates,
      notes: saveNotes,
    });

    refreshCircuits();
    setSaveNotes('');
    showToast(`Saved "${newSaved.name}" locally!`, 'success');
  };

  const handleOverwriteDesign = (design: SavedCircuitDesign) => {
    if (currentGates.length === 0) {
      showToast('Current circuit is empty!', 'error');
      return;
    }
    saveCircuitDesign({
      id: design.id,
      name: design.name,
      missionId: currentMission.id,
      missionTitle: currentMission.title,
      numQubits: currentNumQubits,
      gates: currentGates,
      notes: design.notes,
    });
    refreshCircuits();
    showToast(`Updated "${design.name}" with current circuit gates!`, 'success');
  };

  const handleLoad = (design: SavedCircuitDesign) => {
    onLoadCircuit(design.gates, design.numQubits, design.missionId);
    showToast(`Loaded "${design.name}" into canvas!`, 'success');
    onClose();
  };

  const handleRestoreAutoSave = () => {
    if (!autoSaveDraft) return;
    onLoadCircuit(autoSaveDraft.gates, autoSaveDraft.numQubits, currentMission.id);
    showToast('Restored auto-saved draft!', 'success');
    onClose();
  };

  const handleClearAutoSave = () => {
    clearAutoSaveMissionCircuit(currentMission.id);
    setAutoSaveDraft(null);
    showToast('Auto-saved draft cleared.', 'info');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteCircuitDesign(id);
      refreshCircuits();
      showToast(`Deleted "${name}".`, 'info');
    }
  };

  const handleStartEdit = (design: SavedCircuitDesign) => {
    setEditingId(design.id);
    setEditName(design.name);
  };

  const handleSaveEdit = (id: string) => {
    const existing = savedCircuits.find((c) => c.id === id);
    if (existing && editName.trim()) {
      saveCircuitDesign({
        ...existing,
        id,
        name: editName.trim(),
      });
      refreshCircuits();
      setEditingId(null);
      showToast('Renamed design successfully!', 'success');
    }
  };

  const handleDownloadSingle = (design: SavedCircuitDesign) => {
    const filename = `${design.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_circuit.json`;
    downloadCircuitsJson([design], filename);
    showToast(`Downloaded "${filename}"`, 'info');
  };

  const handleExportAll = () => {
    if (savedCircuits.length === 0) {
      showToast('No saved circuits to export.', 'error');
      return;
    }
    downloadCircuitsJson(savedCircuits, 'omniverse_all_saved_circuits.json');
    showToast(`Exported ${savedCircuits.length} circuit designs!`, 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const { importedCount, errors } = importCircuitsFromJson(content);
        if (importedCount > 0) {
          refreshCircuits();
          showToast(`Successfully imported ${importedCount} circuit design(s)!`, 'success');
        } else {
          showToast(`Import failed: ${errors.join(', ')}`, 'error');
        }
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  if (!isOpen) return null;

  // Filtered list
  const filteredCircuits = savedCircuits.filter((circuit) => {
    const matchesMission = filterMissionId === 'all' || circuit.missionId === filterMissionId;
    const matchesSearch =
      circuit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circuit.missionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (circuit.notes && circuit.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMission && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl border text-xs font-mono font-bold shadow-xl flex items-center gap-2 animate-bounce ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                : toastMessage.type === 'error'
                ? 'bg-red-950 border-red-500 text-red-300'
                : 'bg-cyan-950 border-cyan-500 text-cyan-300'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                SAVED QUANTUM CIRCUITS & CHECKPOINTS
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Store, load, import, and export circuit blueprints locally in your browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SAVE CURRENT CANVAS BAR */}
        <div className="bg-slate-950/90 border border-cyan-800/60 rounded-2xl p-4 mb-4 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
              <Save className="w-4 h-4" /> SAVE ACTIVE CANVAS DESIGN
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {currentGates.length} Gate{currentGates.length === 1 ? '' : 's'} placed on q[{currentNumQubits}]
            </span>
          </div>

          <form onSubmit={handleSaveCurrent} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Design Name (e.g., Bell State Entanglement Soln)..."
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
            />
            <button
              type="submit"
              disabled={currentGates.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg disabled:opacity-40 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Save className="w-4 h-4" /> Save Design
            </button>
          </form>
        </div>

        {/* AUTO-SAVE RESTORE ALERT IF DRAFT EXISTS */}
        {autoSaveDraft && autoSaveDraft.gates.length > 0 && (
          <div className="bg-purple-950/40 border border-purple-500/60 rounded-2xl p-3.5 mb-4 flex items-center justify-between gap-3 text-xs font-mono text-purple-200">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Auto-Saved Mission Draft Found!</span>
                <span className="text-[10px] text-purple-300 block">
                  {autoSaveDraft.gates.length} gates saved at{' '}
                  {new Date(autoSaveDraft.savedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRestoreAutoSave}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restore Draft
              </button>
              <button
                onClick={handleClearAutoSave}
                className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-red-400 rounded-lg"
                title="Discard Auto-Save"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* CONTROLS BAR: SEARCH, FILTER, EXPORT/IMPORT */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved designs..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filter by Mission */}
          <select
            value={filterMissionId}
            onChange={(e) =>
              setFilterMissionId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
            }
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono outline-none"
          >
            <option value="all">All Missions ({savedCircuits.length})</option>
            <option value={currentMission.id}>
              Current Mission ({savedCircuits.filter((c) => c.missionId === currentMission.id).length})
            </option>
          </select>

          {/* Import / Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAll}
              disabled={savedCircuits.length === 0}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono flex items-center gap-1.5 disabled:opacity-40"
              title="Export all saved circuits to JSON"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Export All
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono flex items-center gap-1.5"
              title="Import circuits from JSON file"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" /> Import JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* SAVED CIRCUITS LIST CONTAINER */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[200px]">
          {filteredCircuits.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
              <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-mono font-semibold text-slate-400">
                No saved circuit designs found.
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Build a circuit on the grid and click "Save Design" above to keep your checkpoints!
              </p>
            </div>
          ) : (
            filteredCircuits.map((design) => {
              const isEditing = editingId === design.id;
              const uniqueGatesCount = new Set(design.gates.map((g) => g.type)).size;

              return (
                <div
                  key={design.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-slate-900 border border-cyan-500 text-white text-xs font-mono px-2 py-1 rounded"
                          />
                          <button
                            onClick={() => handleSaveEdit(design.id)}
                            className="p-1 text-emerald-400 hover:text-white"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                            {design.name}
                          </h3>
                          <button
                            onClick={() => handleStartEdit(design)}
                            className="p-1 text-slate-500 hover:text-slate-300"
                            title="Rename design"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </>
                      )}

                      <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[10px] font-semibold">
                        Mission {design.missionId}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-3 pt-0.5">
                      <span>⚡ Qubits: <strong className="text-cyan-400">{design.numQubits}</strong></span>
                      <span>🧩 Gates: <strong className="text-emerald-400">{design.gates.length}</strong></span>
                      <span>🕒 {new Date(design.updatedAt).toLocaleDateString()} {new Date(design.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Gates Preview Badges */}
                    <div className="flex items-center gap-1 pt-2 overflow-x-auto">
                      <span className="text-[10px] text-slate-500 font-mono mr-1">Gates:</span>
                      {design.gates.slice(0, 10).map((g, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-[9px] rounded font-bold"
                        >
                          {g.type}(q{g.qubit})
                        </span>
                      ))}
                      {design.gates.length > 10 && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          +{design.gates.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <button
                      onClick={() => handleLoad(design)}
                      className="px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                    >
                      <FolderOpen className="w-3.5 h-3.5" /> Load
                    </button>

                    <button
                      onClick={() => handleOverwriteDesign(design)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-700/60 rounded-xl text-xs font-mono"
                      title="Overwrite this saved slot with active canvas circuit"
                    >
                      <Zap className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDownloadSingle(design)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs"
                      title="Download JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(design.id, design.name)}
                      className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/60 rounded-xl text-xs transition-all"
                      title="Delete design"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>{savedCircuits.length} Saved Design{savedCircuits.length === 1 ? '' : 's'} Total</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
