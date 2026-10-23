"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelGroup, PanelNote, Verdict } from "@/components/tool/ResultsPanel";
import { useProbe } from "@/components/tool/useProbe";
import { describePlatformVersion, detectClientHints, HIGH_ENTROPY_HINTS } from "@/lib/detect/client-hints";

const HINT_LABELS: Record<(typeof HIGH_ENTROPY_HINTS)[number], string> = {
  architecture: "CPU architecture",
  bitness: "Bitness",
  formFactors: "Form factors",
  fullVersionList: "Full version list",
  model: "Device model",
  platformVersion: "Platform version",
  wow64: "32-bit app on 64-bit Windows",
};

export default function Results() {
  const { value, rerun } = useProbe(detectClientHints);

  return (
    <ResultsPanel ready={value !== null} rows={8} onRerun={rerun}>
      {value && !value.supported && (
        <Verdict level="info" title="Not supported in this browser">
          This browser has no navigator.userAgentData object, so it does not offer User-Agent Client Hints. Firefox and Safari
          rely on the user-agent string alone; see the What Is My Browser page for that.
        </Verdict>
      )}
      {value && value.supported && (
        <>
          <PanelGroup title="Sent to every site (low entropy)">
            <DataRow label="Brands" value={value.brands.map((b) => `${b.brand} ${b.version}`).join(", ") || "None"} />
            <DataRow label="Mobile" value={value.mobile === null ? "Not reported" : value.mobile ? "Yes" : "No"} mono={false} />
            <DataRow label="Platform" value={value.platform || "Not reported"} />
          </PanelGroup>
          <PanelGroup title="Returned on request (high entropy)">
            {HIGH_ENTROPY_HINTS.filter((hint) => value.highEntropy[hint]).map((hint) => (
              <DataRow key={hint} label={HINT_LABELS[hint]} value={value.highEntropy[hint]} />
            ))}
            {describePlatformVersion(value.platform, value.highEntropy.platformVersion) && (
              <DataRow label="Windows release" value={describePlatformVersion(value.platform, value.highEntropy.platformVersion)} mono={false} />
            )}
          </PanelGroup>
          {value.withheld.length > 0 && (
            <PanelNote>
              Empty or withheld: {value.withheld.map((hint) => HINT_LABELS[hint]).join(", ")}. An empty device model is normal on
              desktop computers; other gaps can mean the browser or a policy chose not to share the value.
              {value.error && ` The request failed with ${value.error}.`}
            </PanelNote>
          )}
        </>
      )}
    </ResultsPanel>
  );
}
