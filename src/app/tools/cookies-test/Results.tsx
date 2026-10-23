"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelGroup, PanelNote } from "@/components/tool/ResultsPanel";
import { useProbe } from "@/components/tool/useProbe";
import { detectStorage, formatBytes, PROBE_LABELS } from "@/lib/detect/storage";

export default function Results() {
  const { value, rerun } = useProbe(detectStorage);

  return (
    <ResultsPanel ready={value !== null} rows={9} onRerun={rerun}>
      {value && (
        <>
          <PanelGroup title="Can this site store data?">
            <DataRow label="First-party cookie" value={PROBE_LABELS[value.firstPartyCookie]} mono={false} />
            <DataRow label="localStorage" value={PROBE_LABELS[value.localStorage]} mono={false} />
            <DataRow label="sessionStorage" value={PROBE_LABELS[value.sessionStorage]} mono={false} />
            <DataRow label="IndexedDB" value={PROBE_LABELS[value.indexedDB]} mono={false} />
            <DataRow label="Cache Storage" value={PROBE_LABELS[value.cacheStorage]} mono={false} />
            <DataRow label="navigator.cookieEnabled" value={value.cookieEnabledFlag} />
          </PanelGroup>
          <PanelGroup title="Storage budget for this site">
            <DataRow label="Used (estimate)" value={formatBytes(value.usage)} />
            <DataRow label="Quota (estimate)" value={formatBytes(value.quota)} />
            <DataRow label="Persistent storage" value={value.persisted === null ? "Not supported in this browser" : value.persisted ? "Granted" : "Not granted (best effort)"} mono={false} />
          </PanelGroup>
          {value.firstPartyCookie !== "works" && value.cookieEnabledFlag && (
            <PanelNote>
              The browser says cookies are enabled, but the test cookie could not be written. A site-specific block, an extension, or
              strict privacy settings can cause this.
            </PanelNote>
          )}
          <PanelNote>
            Each value is written and deleted straight away. This test only covers storage for this site; it cannot see how your
            browser treats cookies from other sites embedded in a page.
          </PanelNote>
        </>
      )}
    </ResultsPanel>
  );
}
