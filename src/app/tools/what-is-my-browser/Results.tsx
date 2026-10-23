"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelNote } from "@/components/tool/ResultsPanel";
import { useProbe } from "@/components/tool/useProbe";
import { describeUaReduction, detectBrowser, parseBrowserUserAgent } from "@/lib/detect/browser";

function probe() {
  const info = detectBrowser();
  return { info, fromUa: parseBrowserUserAgent(info.userAgent), notes: describeUaReduction(info.userAgent) };
}

export default function Results() {
  const { value, rerun } = useProbe(probe);

  return (
    <ResultsPanel ready={value !== null} rows={9} onRerun={rerun}>
      {value && (
        <>
          <DataRow label="Browser" value={value.info.name} mono={false} />
          <DataRow label="Version" value={value.info.version} />
          {value.fromUa.name !== value.info.name && (
            <DataRow label="Name in user-agent string" value={`${value.fromUa.name} ${value.fromUa.version}`} mono={false} />
          )}
          <DataRow label="Rendering engine" value={`${value.info.engine} ${value.info.engineVersion}`} mono={false} />
          <DataRow label="Platform" value={value.info.platform} mono={false} />
          <DataRow label="Device class" value={value.info.mobile ? "Mobile" : "Desktop or tablet"} mono={false} />
          <DataRow label="navigator.vendor" value={value.info.vendor} />
          <DataRow label="Languages" value={value.info.languages} />
          <DataRow label="User-agent string" value={value.info.userAgent} />
          {value.notes.length > 0 && (
            <PanelNote>
              <strong>Frozen or reduced parts of this string:</strong> {value.notes.join(" ")}
            </PanelNote>
          )}
        </>
      )}
    </ResultsPanel>
  );
}
