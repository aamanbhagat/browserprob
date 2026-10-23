import { fingerprintString } from "@/lib/hash";

export interface CanvasInfo {
  supported: boolean;
  /** Sample ID of the first read. */
  fingerprint: string;
  /** Sample ID of a second, identical drawing read straight afterwards. */
  secondFingerprint: string;
  dataUrl: string;
  /** "stable" when both reads match, "varies" when they differ (per-read noise), "blank" when readback returned an empty image. */
  readback: "stable" | "varies" | "blank" | "unavailable";
}

const WIDTH = 280;
const HEIGHT = 60;

function drawSample(): { dataUrl: string; blankUrl: string } | null {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const blank = document.createElement("canvas");
  blank.width = WIDTH;
  blank.height = HEIGHT;
  const blankUrl = blank.toDataURL();

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#1642d8";
  ctx.font = "18px Arial";
  ctx.fillText("BrowserProbe 🌐", 10, 25);

  ctx.fillStyle = "rgba(14, 116, 144, 0.82)";
  ctx.font = "14px Georgia";
  ctx.fillText("Canvas Fingerprint Test", 10, 48);

  ctx.beginPath();
  ctx.arc(240, 30, 20, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(245, 158, 11, 0.28)";
  ctx.fill();

  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, 10);
  ctx.bezierCurveTo(220, 50, 260, 10, 270, 50);
  ctx.stroke();

  return { dataUrl: canvas.toDataURL(), blankUrl };
}

export function compareReadbacks(first: string, second: string, blank: string): CanvasInfo["readback"] {
  if (first === blank) return "blank";
  return first === second ? "stable" : "varies";
}

export function detectCanvas(): CanvasInfo {
  const unavailable: CanvasInfo = { supported: false, fingerprint: "N/A", secondFingerprint: "N/A", dataUrl: "", readback: "unavailable" };
  try {
    const first = drawSample();
    const second = drawSample();
    if (!first || !second) return unavailable;
    return {
      supported: true,
      fingerprint: fingerprintString(first.dataUrl),
      secondFingerprint: fingerprintString(second.dataUrl),
      dataUrl: first.dataUrl,
      readback: compareReadbacks(first.dataUrl, second.dataUrl, first.blankUrl),
    };
  } catch {
    return unavailable;
  }
}
