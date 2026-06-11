export interface NetworkInfo {
  effectiveType: string;
  downlink: string;
  rtt: string;
  saveData: string;
  type: string;
  online: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    type?: string;
  };
}

export function detectNetwork(): NetworkInfo {
  const nav = navigator as NavigatorWithConnection;
  const conn = nav.connection;

  return {
    effectiveType: conn?.effectiveType || "Not available",
    downlink: conn?.downlink !== undefined ? `${conn.downlink} Mbps` : "Not available",
    rtt: conn?.rtt !== undefined ? `${conn.rtt} ms` : "Not available",
    saveData: conn?.saveData !== undefined ? (conn.saveData ? "Enabled" : "Disabled") : "Not available",
    type: conn?.type || "Not available",
    online: navigator.onLine,
  };
}
