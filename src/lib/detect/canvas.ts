import { fingerprintString } from "@/lib/hash";

export interface CanvasInfo {
  supported: boolean;
  fingerprint: string;
  dataUrl: string;
}

export function detectCanvas(): CanvasInfo {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 280;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { supported: false, fingerprint: "N/A", dataUrl: "" };

    // Draw test pattern
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 280, 60);

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

    const dataUrl = canvas.toDataURL();

    const fingerprint = fingerprintString(dataUrl);

    return { supported: true, fingerprint, dataUrl };
  } catch {
    return { supported: false, fingerprint: "N/A", dataUrl: "" };
  }
}
