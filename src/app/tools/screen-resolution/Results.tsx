"use client";

import { useEffect, useState } from "react";
import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelGroup, PanelNote } from "@/components/tool/ResultsPanel";
import { useProbe } from "@/components/tool/useProbe";
import { detectScreen, type ScreenInfo } from "@/lib/detect/screen";

const size = (width: number, height: number) => `${width} × ${height}`;

export default function Results() {
  const { value: initial, rerun } = useProbe(detectScreen);
  const [live, setLive] = useState<ScreenInfo | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setLive(detectScreen()));
    };
    window.addEventListener("resize", update);
    screen.orientation?.addEventListener?.("change", update);
    window.visualViewport?.addEventListener("resize", update);
    const queries = ["(prefers-color-scheme: dark)", "(prefers-reduced-motion: reduce)", "(prefers-contrast: more)", "(forced-colors: active)"].map((q) => matchMedia(q));
    queries.forEach((query) => query.addEventListener("change", update));
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      screen.orientation?.removeEventListener?.("change", update);
      window.visualViewport?.removeEventListener("resize", update);
      queries.forEach((query) => query.removeEventListener("change", update));
    };
  }, []);

  const info = live ?? initial;

  return (
    <ResultsPanel ready={info !== null} rows={12} onRerun={() => { setLive(null); rerun(); }}>
      {info && (
        <>
          <PanelGroup title="Sizes in CSS pixels">
            <DataRow label="Screen resolution" value={size(info.screenWidth, info.screenHeight)} />
            <DataRow label="Available screen area" value={size(info.availWidth, info.availHeight)} />
            <DataRow label="Browser window (outer)" value={size(info.outerWidth, info.outerHeight)} />
            <DataRow label="Viewport (inner)" value={size(info.viewportWidth, info.viewportHeight)} />
            <DataRow label="Visual viewport" value={info.visualViewport ? `${size(info.visualViewport.width, info.visualViewport.height)} at ${info.visualViewport.scale}× zoom` : "Not supported in this browser"} />
            <DataRow label="Device pixel ratio" value={info.devicePixelRatio} />
            <DataRow label="Screen in device pixels (approx.)" value={size(Math.round(info.screenWidth * info.devicePixelRatio), Math.round(info.screenHeight * info.devicePixelRatio))} />
          </PanelGroup>
          <PanelGroup title="Display and input">
            <DataRow label="Color depth" value={`${info.colorDepth}-bit`} />
            <DataRow label="Color gamut" value={info.colorGamut} />
            <DataRow label="Dynamic range" value={info.dynamicRange} />
            <DataRow label="Orientation" value={info.orientation} />
            <DataRow label="Touch points" value={info.maxTouchPoints} />
          </PanelGroup>
          <PanelGroup title="Display preferences">
            <DataRow label="Color scheme" value={info.colorScheme} />
            <DataRow label="Reduced motion" value={info.reducedMotion} />
            <DataRow label="Contrast" value={info.contrast} />
            <DataRow label="Forced colors" value={info.forcedColors} />
          </PanelGroup>
          <PanelNote>
            Resize the window, rotate your device or zoom in, and these values update. Browser zoom changes the CSS-pixel sizes and
            the pixel ratio, so the &quot;device pixels&quot; row is an estimate.
          </PanelNote>
        </>
      )}
    </ResultsPanel>
  );
}
