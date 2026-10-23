"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { Verdict } from "@/components/tool/ResultsPanel";
import extra from "@/components/tool/results.module.css";
import { useProbe } from "@/components/tool/useProbe";
import { detectCanvas } from "@/lib/detect/canvas";

const READBACK = {
  stable: {
    level: "info" as const,
    title: "Both reads returned the same image",
    text: "Your browser draws this image the same way every time, so a site could reuse the sample ID as one stable signal. Many devices with the same browser, OS and GPU produce the same ID.",
  },
  varies: {
    level: "ok" as const,
    title: "The two reads differ",
    text: "Your browser changed the pixels between two identical drawings, which is how per-read noise defenses work. A site cannot rely on this canvas signal staying the same.",
  },
  blank: {
    level: "ok" as const,
    title: "The browser returned a blank image",
    text: "Canvas readback was blocked or replaced with an empty image, so this signal carries no information about your device.",
  },
  unavailable: {
    level: "info" as const,
    title: "Canvas 2D is not available",
    text: "The browser did not provide a 2D canvas context, so nothing could be drawn or read.",
  },
};

export default function Results() {
  const { value, rerun } = useProbe(detectCanvas);
  const verdict = value ? READBACK[value.readback] : null;

  return (
    <ResultsPanel ready={value !== null} rows={4} onRerun={rerun}>
      {value && verdict && (
        <>
          <Verdict level={verdict.level} title={verdict.title}>{verdict.text}</Verdict>
          <DataRow label="Sample ID (read 1)" value={value.fingerprint} />
          <DataRow label="Sample ID (read 2)" value={value.secondFingerprint} />
          {value.dataUrl && (
            <div className={extra.canvasPreview}>
              {/* eslint-disable-next-line @next/next/no-img-element -- a data: URL produced in this tab */}
              <img src={value.dataUrl} alt="The test image your browser drew: the words BrowserProbe and Canvas Fingerprint Test, a circle and a curve" width={280} height={60} />
            </div>
          )}
        </>
      )}
    </ResultsPanel>
  );
}
