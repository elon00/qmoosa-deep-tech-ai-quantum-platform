import { GatePlacement } from './quantumEngine';

export interface SavedCircuitDesign {
  id: string;
  name: string;
  missionId: number;
  missionTitle: string;
  numQubits: number;
  gates: GatePlacement[];
  totalShots?: number;
  noiseLevel?: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  tags?: string[];
}

const STORAGE_KEY = 'omniverse_saved_circuits';
const AUTOSAVE_PREFIX = 'omniverse_autosave_mission_';

/**
 * Retrieve all saved circuit designs from localStorage
 */
export function getSavedCircuits(): SavedCircuitDesign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to parse saved circuits from localStorage:', err);
    return [];
  }
}

/**
 * Save or update a circuit design
 */
export function saveCircuitDesign(
  designData: Omit<SavedCircuitDesign, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): SavedCircuitDesign {
  const circuits = getSavedCircuits();
  const now = new Date().toISOString();

  if (designData.id) {
    // Update existing
    const existingIndex = circuits.findIndex((c) => c.id === designData.id);
    if (existingIndex !== -1) {
      const updated: SavedCircuitDesign = {
        ...circuits[existingIndex],
        ...designData,
        id: designData.id,
        updatedAt: now,
      };
      circuits[existingIndex] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
      return updated;
    }
  }

  // Create new
  const newDesign: SavedCircuitDesign = {
    id: `circuit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: designData.name || `Circuit Design ${circuits.length + 1}`,
    missionId: designData.missionId,
    missionTitle: designData.missionTitle,
    numQubits: designData.numQubits,
    gates: designData.gates,
    totalShots: designData.totalShots ?? 1024,
    noiseLevel: designData.noiseLevel ?? 0,
    createdAt: now,
    updatedAt: now,
    notes: designData.notes || '',
    tags: designData.tags || [],
  };

  circuits.unshift(newDesign);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
  return newDesign;
}

/**
 * Delete a saved circuit design
 */
export function deleteCircuitDesign(id: string): void {
  const circuits = getSavedCircuits().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
}

/**
 * Export saved designs as JSON string for download
 */
export function exportCircuitsToJson(circuits?: SavedCircuitDesign[]): string {
  const data = circuits || getSavedCircuits();
  return JSON.stringify(data, null, 2);
}

/**
 * Download a circuit or list of circuits as a .json file
 */
export function downloadCircuitsJson(circuits: SavedCircuitDesign[], filename = 'omniverse_quantum_circuits.json'): void {
  const jsonStr = JSON.stringify(circuits, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import circuit designs from JSON text or uploaded file content
 */
export function importCircuitsFromJson(jsonString: string): { importedCount: number; errors: string[] } {
  const errors: string[] = [];
  try {
    const data = JSON.parse(jsonString);
    const itemsToImport = Array.isArray(data) ? data : [data];
    const existing = getSavedCircuits();
    let importedCount = 0;

    for (const item of itemsToImport) {
      if (!item || typeof item !== 'object') {
        errors.push('Invalid JSON object format');
        continue;
      }
      if (!Array.isArray(item.gates)) {
        errors.push(`Circuit "${item.name || 'Unnamed'}" is missing valid gates array.`);
        continue;
      }

      const now = new Date().toISOString();
      const validItem: SavedCircuitDesign = {
        id: item.id || `circuit-imp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: item.name || 'Imported Quantum Circuit',
        missionId: typeof item.missionId === 'number' ? item.missionId : 1,
        missionTitle: item.missionTitle || 'Custom Mission',
        numQubits: typeof item.numQubits === 'number' ? item.numQubits : 2,
        gates: item.gates,
        totalShots: item.totalShots || 1024,
        noiseLevel: item.noiseLevel || 0,
        createdAt: item.createdAt || now,
        updatedAt: now,
        notes: item.notes || 'Imported from external file',
        tags: item.tags || ['Imported'],
      };

      // Avoid exact ID collision
      const idx = existing.findIndex((e) => e.id === validItem.id);
      if (idx !== -1) {
        validItem.id = `circuit-imp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      }

      existing.unshift(validItem);
      importedCount++;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return { importedCount, errors };
  } catch (err: any) {
    return { importedCount: 0, errors: [err?.message || 'Failed to parse JSON file'] };
  }
}

/**
 * Auto-Save draft for a specific mission
 */
export function autoSaveMissionCircuit(
  missionId: number,
  missionTitle: string,
  numQubits: number,
  gates: GatePlacement[]
): void {
  try {
    const key = `${AUTOSAVE_PREFIX}${missionId}`;
    const draft = {
      missionId,
      missionTitle,
      numQubits,
      gates,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(draft));
  } catch (err) {
    console.error('AutoSave failed:', err);
  }
}

/**
 * Get auto-saved draft for a mission if available
 */
export function getAutoSaveMissionCircuit(missionId: number): {
  numQubits: number;
  gates: GatePlacement[];
  savedAt: string;
} | null {
  try {
    const key = `${AUTOSAVE_PREFIX}${missionId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.gates)) {
      return parsed;
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Clear auto-saved draft for a mission
 */
export function clearAutoSaveMissionCircuit(missionId: number): void {
  try {
    const key = `${AUTOSAVE_PREFIX}${missionId}`;
    localStorage.removeItem(key);
  } catch (err) {
    console.error('Clear AutoSave failed:', err);
  }
}
