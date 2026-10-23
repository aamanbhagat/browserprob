import { fingerprintNumbers } from "@/lib/hash";

export interface AudioInfo {
  supported: boolean;
  /** Sample ID of the first offline render. */
  fingerprint: string;
  /** Sample ID of a second, identical render. */
  secondFingerprint: string;
  sampleRate: number;
  /** "complete", "timeout" or "N/A". */
  state: string;
  /** "stable" when both renders match, "varies" when they differ, "unavailable" otherwise. */
  renders: "stable" | "varies" | "unavailable";
}

const SAMPLE_RATE = 44100;
const LENGTH = 4096;

type OfflineContextConstructor = typeof OfflineAudioContext;

// Renders a fixed oscillator → compressor graph silently. Nothing reaches the speakers, and no live
// AudioContext is created, so browsers' autoplay policies are not involved.
async function renderSample(OfflineCtx: OfflineContextConstructor): Promise<Float32Array | null> {
  const context = new OfflineCtx(1, LENGTH, SAMPLE_RATE);

  const oscillator = context.createOscillator();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(10000, context.currentTime);

  const compressor = context.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-50, context.currentTime);
  compressor.knee.setValueAtTime(40, context.currentTime);
  compressor.ratio.setValueAtTime(12, context.currentTime);
  compressor.attack.setValueAtTime(0, context.currentTime);
  compressor.release.setValueAtTime(0.25, context.currentTime);

  oscillator.connect(compressor);
  compressor.connect(context.destination);
  oscillator.start(0);

  const rendered = await Promise.race([
    context.startRendering(),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
  ]);
  return rendered ? rendered.getChannelData(0) : null;
}

export async function detectAudio(): Promise<AudioInfo> {
  const fail: AudioInfo = { supported: false, fingerprint: "N/A", secondFingerprint: "N/A", sampleRate: 0, state: "N/A", renders: "unavailable" };

  try {
    const OfflineCtx =
      window.OfflineAudioContext ||
      (window as unknown as { webkitOfflineAudioContext?: OfflineContextConstructor }).webkitOfflineAudioContext;
    if (!OfflineCtx) return fail;

    const first = await renderSample(OfflineCtx);
    if (!first) return { ...fail, supported: true, sampleRate: SAMPLE_RATE, state: "timeout" };
    const second = await renderSample(OfflineCtx);

    const fingerprint = fingerprintNumbers(first);
    const secondFingerprint = second ? fingerprintNumbers(second) : "N/A";
    return {
      supported: true,
      fingerprint,
      secondFingerprint,
      sampleRate: SAMPLE_RATE,
      state: "complete",
      renders: second ? (fingerprint === secondFingerprint ? "stable" : "varies") : "unavailable",
    };
  } catch {
    return fail;
  }
}
