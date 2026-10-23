"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelGroup, PanelNote } from "@/components/tool/ResultsPanel";
import extra from "@/components/tool/results.module.css";
import { useProbe } from "@/components/tool/useProbe";
import { detectWebGL, detectWebGPU } from "@/lib/detect/webgl";

const WEBGPU_STATUS = {
  "not-supported": "Not supported in this browser",
  "no-adapter": "API present, but no adapter was offered",
  error: "The adapter request failed",
  available: "Available",
} as const;

async function probe() {
  return { webgl: detectWebGL(), webgpu: await detectWebGPU() };
}

export default function Results() {
  const { value, rerun } = useProbe(probe);

  return (
    <ResultsPanel ready={value !== null} rows={10} onRerun={rerun}>
      {value && (
        <>
          <PanelGroup title="WebGL">
            <DataRow label="WebGL" value={value.webgl.supported ? (value.webgl.webgl2 ? "WebGL 2.0 and 1.0" : "WebGL 1.0 only") : "Not available"} mono={false} />
            {value.webgl.supported && (
              <>
                <DataRow label="Renderer" value={value.webgl.renderer} />
                <DataRow label="Vendor" value={value.webgl.vendor} />
                <DataRow label="Renderer read from" value={value.webgl.rendererSource === "WEBGL_debug_renderer_info" ? "WEBGL_debug_renderer_info extension" : "gl.RENDERER"} />
                <DataRow label="Version string" value={value.webgl.version} />
                <DataRow label="Shading language" value={value.webgl.shadingLanguageVersion} />
                <DataRow label="Max texture size" value={`${value.webgl.maxTextureSize} px`} />
                <DataRow label="Max viewport" value={value.webgl.maxViewportDims} />
              </>
            )}
          </PanelGroup>
          {value.webgl.extensions.length > 0 && (
            <details className={extra.details}>
              <summary>{value.webgl.extensions.length} WebGL extensions</summary>
              <p className={extra.monoList}>{value.webgl.extensions.join(", ")}</p>
            </details>
          )}
          <PanelGroup title="WebGPU">
            <DataRow label="WebGPU adapter" value={WEBGPU_STATUS[value.webgpu.status]} mono={false} />
            {value.webgpu.status === "available" && (
              <>
                <DataRow label="Vendor" value={value.webgpu.vendor || "Withheld"} />
                <DataRow label="Architecture" value={value.webgpu.architecture || "Withheld"} />
                {value.webgpu.description && <DataRow label="Description" value={value.webgpu.description} />}
                <DataRow label="Software fallback adapter" value={value.webgpu.isFallbackAdapter === null ? "Not reported" : value.webgpu.isFallbackAdapter ? "Yes" : "No"} mono={false} />
                <DataRow label="Optional features" value={value.webgpu.featureCount} />
              </>
            )}
          </PanelGroup>
          {!value.webgl.supported && (
            <PanelNote>
              WebGL can be missing because hardware acceleration is off, the graphics driver is blocklisted, or the browser runs
              without a GPU (as in many virtual machines and test environments).
            </PanelNote>
          )}
        </>
      )}
    </ResultsPanel>
  );
}
