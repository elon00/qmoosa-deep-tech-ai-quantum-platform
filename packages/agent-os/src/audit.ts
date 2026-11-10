export interface AgentAuditRecord {
  agentId: string;
  action: string;
  decision: "ALLOW" | "DENY";
  reason: string;
  timestamp: string;
}

export function createAuditRecord(input: Omit<AgentAuditRecord, "timestamp"> & { timestamp?: string }): AgentAuditRecord {
  return {
    ...input,
    timestamp: input.timestamp ?? new Date().toISOString(),
  };
}
