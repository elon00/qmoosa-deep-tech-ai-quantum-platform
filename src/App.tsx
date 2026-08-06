import React, { useState, useMemo, useEffect } from 'react';
import { ChatGPTInterface } from './components/ChatGPTInterface';
import { IbmHardwareModal } from './components/IbmHardwareModal';
import { PythonScriptModal } from './components/PythonScriptModal';
import { SavedCircuitsModal } from './components/SavedCircuitsModal';

import { MISSIONS, Mission } from './data/missions';
import { GatePlacement, GateType, simulateQuantumCircuit } from './lib/quantumEngine';
import { playQuantumSound } from './lib/audioEffects';
import { autoSaveMissionCircuit, getAutoSaveMissionCircuit } from './lib/circuitStorage';

export default function App() {
  const [currentMissionId, setCurrentMissionId] = useState<number>(1);
  const [gates, setGates] = useState<GatePlacement[]>([]);
  const [selectedGate, setSelectedGate] = useState<GateType | null>('H');
  const [totalShots, setTotalShots] = useState<number>(1024);
  const [noiseLevel, setNoiseLevel] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // IBM Hardware settings
  const [executionMode, setExecutionMode] = useState<'simulator' | 'ibm_hardware'>('simulator');
  const [ibmToken, setIbmToken] = useState<string>(() => localStorage.getItem('ibm_token') || '');
  const [selectedBackend, setSelectedBackend] = useState<string>('ibmq_qasm_simulator');

  // Modals
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState<boolean>(false);
  const [isPythonModalOpen, setIsPythonModalOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  // Verification state
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    feedback: string;
    score: number;
  } | null>(null);

  const currentMission: Mission = useMemo(() => {
    return MISSIONS.find((m) => m.id === currentMissionId) || MISSIONS[0];
  }, [currentMissionId]);

  const [numQubits, setNumQubits] = useState<number>(currentMission.numQubits);

  // Reset or adjust circuit when mission changes, restoring draft if available
  useEffect(() => {
    const draft = getAutoSaveMissionCircuit(currentMission.id);
    if (draft && draft.gates && draft.gates.length > 0) {
      setNumQubits(draft.numQubits || currentMission.numQubits);
      setGates(draft.gates);
    } else {
      setNumQubits(currentMission.numQubits);
      setGates(currentMission.initialGates || []);
    }
    setVerificationResult(null);
  }, [currentMissionId, currentMission]);

  // Auto-save active circuit progress on every gate/qubit edit
  useEffect(() => {
    if (gates.length > 0) {
      autoSaveMissionCircuit(currentMission.id, currentMission.title, numQubits, gates);
    }
  }, [gates, numQubits, currentMission]);

  const handleSaveToken = (token: string) => {
    setIbmToken(token);
    localStorage.setItem('ibm_token', token);
  };

  const handleLoadCircuit = (newGates: GatePlacement[], newQubits: number, missionId?: number) => {
    if (missionId && missionId !== currentMissionId) {
      setCurrentMissionId(missionId);
    }
    setNumQubits(newQubits);
    setGates(newGates);
    setVerificationResult(null);
    if (soundEnabled) playQuantumSound.gatePlace(600);
  };

  // Compute quantum statevector & measurement probabilities
  const simulationResult = useMemo(() => {
    return simulateQuantumCircuit(numQubits, gates, totalShots, noiseLevel);
  }, [numQubits, gates, totalShots, noiseLevel]);

  const handleAddGate = (gate: GatePlacement) => {
    setGates((prev) => [...prev, gate]);
    if (soundEnabled) playQuantumSound.gatePlace(520);
    setVerificationResult(null);
  };

  const handleRemoveGate = (gateId: string) => {
    setGates((prev) => prev.filter((g) => g.id !== gateId));
    if (soundEnabled) playQuantumSound.gatePlace(300);
    setVerificationResult(null);
  };

  const handleClearCircuit = () => {
    setGates([]);
    setVerificationResult(null);
  };

  const handleVerifyMission = () => {
    if (soundEnabled) playQuantumSound.measurementTrigger();
    const result = currentMission.checkCompletion(simulationResult, gates);
    setVerificationResult(result);
    if (result.success && soundEnabled) {
      playQuantumSound.levelSuccess();
    } else if (!result.success && soundEnabled) {
      playQuantumSound.errorTone();
    }
  };

  const handleNextMission = () => {
    if (currentMissionId < MISSIONS.length) {
      setCurrentMissionId(currentMissionId + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* ChatGPT Layout */}
      <ChatGPTInterface
        currentMission={currentMission}
        onSelectMission={(id) => setCurrentMissionId(id)}
        numQubits={numQubits}
        onNumQubitsChange={(num) => setNumQubits(num)}
        gates={gates}
        selectedGate={selectedGate}
        onSelectGate={(gate) => setSelectedGate(gate)}
        onAddGate={handleAddGate}
        onRemoveGate={handleRemoveGate}
        onClearCircuit={handleClearCircuit}
        simulationResult={simulationResult}
        totalShots={totalShots}
        onShotsChange={(s) => setTotalShots(s)}
        noiseLevel={noiseLevel}
        onNoiseLevelChange={(n) => setNoiseLevel(n)}
        executionMode={executionMode}
        onSetExecutionMode={(m) => setExecutionMode(m)}
        onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
        onOpenPythonModal={() => setIsPythonModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        verificationResult={verificationResult}
        onVerifyMission={handleVerifyMission}
        onNextMission={handleNextMission}
        onApplySolutionGates={(solutionGates, newQubits) => handleLoadCircuit(solutionGates, newQubits)}
      />

      {/* Modals */}
      <SavedCircuitsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        currentMission={currentMission}
        currentNumQubits={numQubits}
        currentGates={gates}
        onLoadCircuit={handleLoadCircuit}
        soundEnabled={soundEnabled}
      />

      <IbmHardwareModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        ibmToken={ibmToken}
        onSaveToken={handleSaveToken}
        selectedBackend={selectedBackend}
        onSelectBackend={(b) => setSelectedBackend(b)}
        executionMode={executionMode}
        onSetExecutionMode={(m) => setExecutionMode(m)}
        qasmCode={simulationResult.qasm}
      />

      <PythonScriptModal
        isOpen={isPythonModalOpen}
        onClose={() => setIsPythonModalOpen(false)}
        qiskitCode={simulationResult.qiskitCode}
      />
    </div>
  );
}

