"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelGroup, PanelNote } from "@/components/tool/ResultsPanel";
import { useProbe } from "@/components/tool/useProbe";
import { detectNavigationTiming, detectNetwork } from "@/lib/detect/network";
import { formatBytes } from "@/lib/detect/storage";

const ms = (value: number | null, missing = "Not measured") => (value === null ? missing : `${value} ms`);

function probe() {
  return { network: detectNetwork(), timing: detectNavigationTiming() };
}

export default function Results() {
  const { value, rerun } = useProbe(probe);

  return (
    <ResultsPanel ready={value !== null} rows={10} onRerun={rerun}>
      {value && (
        <>
          <PanelGroup title="How the first page in this tab loaded">
            {value.timing ? (
              <>
                <DataRow label="Protocol" value={value.timing.protocol} />
                <DataRow label="DNS lookup" value={ms(value.timing.dns, "Reused or not measured")} />
                <DataRow label="Connection setup" value={ms(value.timing.connect, "Reused connection")} />
                <DataRow label="TLS handshake" value={ms(value.timing.tls, "Reused or not measured")} />
                <DataRow label="Time to first byte" value={ms(value.timing.ttfb)} />
                <DataRow label="HTML download" value={ms(value.timing.download)} />
                <DataRow label="Total until HTML received" value={ms(value.timing.total)} />
                <DataRow label="HTML transfer size" value={value.timing.transferSize === null ? "Not reported (cached or hidden)" : formatBytes(value.timing.transferSize)} />
                <DataRow label="Navigation type" value={value.timing.navigationType} />
              </>
            ) : (
              <DataRow label="Navigation Timing" value="Not supported in this browser" mono={false} />
            )}
          </PanelGroup>
          <PanelGroup title="Network Information API (Chromium only)">
            <DataRow label="Effective connection type" value={value.network.effectiveType} />
            <DataRow label="Downlink estimate" value={value.network.downlink} />
            <DataRow label="Round-trip estimate" value={value.network.rtt} />
            <DataRow label="Data Saver" value={value.network.saveData} mono={false} />
            <DataRow label="Connection type" value={value.network.type} mono={false} />
            <DataRow label="Browser reports online" value={value.network.online} />
          </PanelGroup>
          <PanelNote>
            The timing describes the document request that opened this site in this tab; moving between pages inside the site does
            not create a new measurement. Reload the page to measure again. None of these numbers is a bandwidth test.
          </PanelNote>
        </>
      )}
    </ResultsPanel>
  );
}
