import { fingerprintNumbers } from "@/lib/hash";

export interface AudioInfo {
  supported: boolean;
  fingerprint: string;
  sampleRate: number;
  channelCount: number;
  state: string;
}

export async function detectAudio(): Promise<AudioInfo> {
  const fail: AudioInfo = { supported: false, fingerprint: "N/A", sampleRate: 0, channelCount: 0, state: "N/A" };

  try {
    // Use OfflineAudioContext — it processes immediately without needing
    // a user gesture, unlike the live AudioContext which starts suspended.
    const OfflineCtx = window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;
    if (!OfflineCtx) return fail;

    const length = 4096;
    const sampleRate = 44100;
    const context = new OfflineCtx(1, length, sampleRate);

    // Also probe the live context for metadata (but don't use it for processing)
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    let channelCount = 0;
    if (AudioCtx) {
      try {
        const liveCtx = new AudioCtx();
        channelCount = liveCtx.destination.maxChannelCount;
        liveCtx.close();
      } catch { /* */ }
    }

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

    // Race between rendering and a 2s timeout
    const rendered = await Promise.race([
      context.startRendering(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
    ]);

    if (!rendered) return { ...fail, supported: true, sampleRate, channelCount, state: "timeout" };

    const data = rendered.getChannelData(0);
    const fingerprint = fingerprintNumbers(data);

    return { supported: true, fingerprint, sampleRate, channelCount, state: "complete" };
  } catch {
    return fail;
  }
}
