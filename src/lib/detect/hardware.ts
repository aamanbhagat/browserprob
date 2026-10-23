import { detectWebGL } from "@/lib/detect/webgl";

export const NOT_SUPPORTED = "Not supported in this browser";

export interface HardwareInfo {
  /** navigator.hardwareConcurrency, or 0 when not exposed. */
  cpuCores: number;
  deviceMemory: string;
  maxTouchPoints: number;
  platform: string;
  gpu: string;
  batteryStatus: string;
  batteryLevel: string;
  batteryCharging: string;
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

interface BatteryManager {
  level: number;
  charging: boolean;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export function formatDeviceMemory(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return NOT_SUPPORTED;
  return value < 1 ? `${value * 1024} MB (rounded)` : `${value} GB (rounded)`;
}

export async function detectHardware(): Promise<HardwareInfo> {
  const nav = navigator as NavigatorWithMemory & NavigatorWithBattery;

  let gpu = NOT_SUPPORTED;
  try {
    const webgl = detectWebGL();
    if (webgl.supported) gpu = webgl.renderer;
  } catch {
    // WebGL can throw when the GPU process is unavailable.
  }

  let batteryStatus = NOT_SUPPORTED;
  let batteryLevel = NOT_SUPPORTED;
  let batteryCharging = NOT_SUPPORTED;
  if (typeof nav.getBattery === "function") {
    try {
      const battery = await nav.getBattery();
      batteryLevel = `${Math.round(battery.level * 100)}%`;
      batteryCharging = battery.charging ? "Charging" : "Not charging";
      batteryStatus = "Available";
    } catch {
      batteryStatus = "Blocked by the browser or site policy";
      batteryLevel = batteryCharging = "Unavailable";
    }
  }

  return {
    cpuCores: navigator.hardwareConcurrency || 0,
    deviceMemory: formatDeviceMemory(nav.deviceMemory),
    maxTouchPoints: navigator.maxTouchPoints || 0,
    platform: navigator.platform || "Unknown",
    gpu,
    batteryStatus,
    batteryLevel,
    batteryCharging,
  };
}
