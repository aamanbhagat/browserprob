"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelNote } from "@/components/tool/ResultsPanel";
import { useProbe } from "@/components/tool/useProbe";
import { detectPrivacy } from "@/lib/detect/privacy";

const GPC_TEXT: Record<string, string> = {
  Enabled: "On: sites receive an opt-out signal",
  Disabled: "Off",
  "Not supported": "Not supported in this browser",
};

const DNT_TEXT: Record<string, string> = {
  Enabled: "On",
  Disabled: "Off (explicitly allows tracking)",
  "Not set": "Off",
  "Not exposed": "Not exposed by this browser",
};

export default function Results() {
  const { value, rerun } = useProbe(detectPrivacy);

  return (
    <ResultsPanel ready={value !== null} rows={3} onRerun={rerun}>
      {value && (
        <>
          <DataRow label="Global Privacy Control" value={GPC_TEXT[value.globalPrivacyControl] ?? value.globalPrivacyControl} mono={false} />
          <DataRow label="Do Not Track" value={DNT_TEXT[value.doNotTrack] ?? value.doNotTrack} mono={false} />
          <DataRow label="navigator.doNotTrack (raw)" value={value.doNotTrack === "Not exposed" ? "Property not present" : String(value.doNotTrackRaw)} />
          <PanelNote>
            These are the JavaScript values. Browsers that support the signals also send them as the <code>Sec-GPC: 1</code> and{" "}
            <code>DNT: 1</code> request headers. Neither signal blocks tracking by itself; it only states your preference.
          </PanelNote>
        </>
      )}
    </ResultsPanel>
  );
}
