const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export interface EnterpriseHealthResult {
  systemStatus: string;
  uptimePercentage: string;
  activeUserSessions: number;
  cpuUtilization: string;
  memoryUsage: string;
  databaseConnections: string;
  fastapiResponseTimeMs: number;
  nextjsBuildStatus: string;
}

export async function fetchSystemHealth(): Promise<EnterpriseHealthResult> {
  const res = await fetch(`${API_BASE_URL}/enterprise/admin/health`);
  if (!res.ok) {
    throw new Error(`Failed to fetch system health: ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchFeatureFlags(): Promise<Record<string, boolean>> {
  const res = await fetch(`${API_BASE_URL}/enterprise/feature-flags`);
  if (!res.ok) {
    throw new Error(`Failed to fetch feature flags: ${res.statusText}`);
  }
  return await res.json();
}
