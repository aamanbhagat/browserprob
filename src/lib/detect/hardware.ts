export interface HardwareInfo {
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
  chargingTime: number;
  dischargingTime: number;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export async function detectHardware(): Promise<HardwareInfo> {
  const nav = navigator as NavigatorWithMemory & NavigatorWithBattery;

  // GPU via WebGL
  let gpu = "Not available";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "Hidden";
      }
    }
  } catch {
    // ignore
  }

  // Battery
  let batteryStatus = "Not available";
  let batteryLevel = "Not available";
  let batteryCharging = "Not available";
  try {
    if (nav.getBattery) {
      const battery = await nav.getBattery();
      batteryLevel = `${Math.round(battery.level * 100)}%`;
      batteryCharging = battery.charging ? "Charging" : "Not charging";
      batteryStatus = "Available";
    }
  } catch {
    // ignore
  }

  return {
    cpuCores: navigator.hardwareConcurrency || 0,
    deviceMemory: nav.deviceMemory ? `${nav.deviceMemory} GB` : "Not available",
    maxTouchPoints: navigator.maxTouchPoints || 0,
    platform: navigator.platform || "Unknown",
    gpu,
    batteryStatus,
    batteryLevel,
    batteryCharging,
  };
}
