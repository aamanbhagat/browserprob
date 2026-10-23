"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { Verdict } from "@/components/tool/ResultsPanel";
import extra from "@/components/tool/results.module.css";
import { useProbe } from "@/components/tool/useProbe";
import { detectPlugins } from "@/lib/detect/plugins";

const KIND_TEXT = {
  "standard-pdf-list": {
    title: "The standard five-entry PDF list",
    text: "This is the fixed list every current browser returns when it can show PDFs inline. It says nothing about what you installed.",
  },
  empty: {
    title: "An empty list",
    text: "Current browsers return an empty list when inline PDF viewing is off or unavailable, as in many headless and kiosk browsers.",
  },
  "non-standard": {
    title: "A non-standard list",
    text: "This browser returned plugin names other than the standard PDF entries. Older browser versions and some modified browsers still do this, which makes the list more distinctive.",
  },
};

export default function Results() {
  const { value, rerun } = useProbe(detectPlugins);
  const kind = value ? KIND_TEXT[value.kind] : null;

  return (
    <ResultsPanel ready={value !== null} rows={4} onRerun={rerun}>
      {value && kind && (
        <>
          <Verdict level={value.kind === "non-standard" ? "info" : "ok"} title={kind.title}>{kind.text}</Verdict>
          <DataRow label="navigator.pdfViewerEnabled" value={value.pdfViewerEnabled === null ? "Not supported in this browser" : value.pdfViewerEnabled} />
          <DataRow label="Plugin entries" value={value.plugins.length} />
          <DataRow label="MIME types" value={value.mimeTypes.join(", ") || "None"} />
          {value.plugins.length > 0 && (
            <details className={extra.details}>
              <summary>Plugin names ({value.plugins.length})</summary>
              <p className={extra.monoList}>{value.plugins.join(", ")}</p>
            </details>
          )}
        </>
      )}
    </ResultsPanel>
  );
}
