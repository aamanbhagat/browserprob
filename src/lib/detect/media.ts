export interface MediaDeviceEntry {
  kind: MediaDeviceKind;
  /** Empty until the site has camera or microphone permission. */
  label: string;
  /** Whether the browser exposed a per-site device ID for this entry. */
  hasDeviceId: boolean;
}

export interface MediaDevicesInfo {
  supported: boolean;
  devices: MediaDeviceEntry[];
  counts: Record<MediaDeviceKind, number>;
  labelsVisible: boolean;
  error: string | null;
}

export function summarizeDevices(devices: Array<Pick<MediaDeviceInfo, "kind" | "label" | "deviceId">>): Omit<MediaDevicesInfo, "supported" | "error"> {
  const entries = devices.map((device) => ({ kind: device.kind, label: device.label, hasDeviceId: device.deviceId !== "" }));
  return {
    devices: entries,
    counts: {
      audioinput: entries.filter((device) => device.kind === "audioinput").length,
      audiooutput: entries.filter((device) => device.kind === "audiooutput").length,
      videoinput: entries.filter((device) => device.kind === "videoinput").length,
    },
    labelsVisible: entries.some((device) => device.label !== ""),
  };
}

export async function listMediaDevices(): Promise<MediaDevicesInfo> {
  const empty = { devices: [], counts: { audioinput: 0, audiooutput: 0, videoinput: 0 }, labelsVisible: false };
  if (!navigator.mediaDevices?.enumerateDevices) return { supported: false, error: null, ...empty };
  try {
    return { supported: true, error: null, ...summarizeDevices(await navigator.mediaDevices.enumerateDevices()) };
  } catch (error) {
    return { supported: true, error: error instanceof Error ? error.name : "Error", ...empty };
  }
}

/**
 * Asks for camera and/or microphone access only so the browser reveals device names, then stops every
 * track immediately. Nothing is recorded, displayed, or sent anywhere. Must be called from a user action.
 */
export async function revealDeviceLabels(current: MediaDevicesInfo): Promise<MediaDevicesInfo> {
  if (!navigator.mediaDevices?.getUserMedia) return { ...current, error: "NotSupportedError" };
  const constraints = {
    audio: current.counts.audioinput > 0 || current.devices.length === 0,
    video: current.counts.videoinput > 0,
  };
  if (!constraints.audio && !constraints.video) return { ...current, error: "NotFoundError" };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach((track) => track.stop());
    return listMediaDevices();
  } catch (error) {
    return { ...current, error: error instanceof Error ? error.name : "Error" };
  }
}

export const MEDIA_ERROR_MESSAGES: Record<string, string> = {
  NotAllowedError: "Permission was denied, so device names stay hidden.",
  NotFoundError: "No camera or microphone was found to ask about.",
  NotReadableError: "The device is in use by another app or blocked by the operating system.",
  NotSupportedError: "This browser cannot request camera or microphone access here.",
  SecurityError: "The browser blocked the request on this page.",
};
