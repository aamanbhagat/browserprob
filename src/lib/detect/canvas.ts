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
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, 280, 60);

    ctx.fillStyle = "#00d4ff";
    ctx.font = "18px Arial";
    ctx.fillText("BrowserProbe 🌐", 10, 25);

    ctx.fillStyle = "rgba(124, 58, 237, 0.7)";
    ctx.font = "14px Georgia";
    ctx.fillText("Canvas Fingerprint Test", 10, 48);

    ctx.beginPath();
    ctx.arc(240, 30, 20, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 212, 255, 0.3)";
    ctx.fill();

    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 10);
    ctx.bezierCurveTo(220, 50, 260, 10, 270, 50);
    ctx.stroke();

    const dataUrl = canvas.toDataURL();

    // Generate hash
    let hash = 0;
    for (let i = 0; i < dataUrl.length; i++) {
      const char = dataUrl.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const fingerprint = Math.abs(hash).toString(16).padStart(8, "0");

    return { supported: true, fingerprint, dataUrl };
  } catch {
    return { supported: false, fingerprint: "N/A", dataUrl: "" };
  }
}
