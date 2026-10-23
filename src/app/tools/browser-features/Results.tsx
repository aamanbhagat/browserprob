"use client";

import ResultsPanel, { PanelNote } from "@/components/tool/ResultsPanel";
import extra from "@/components/tool/results.module.css";
import { useProbe } from "@/components/tool/useProbe";
import { detectFeatures } from "@/lib/detect/features";

export default function Results() {
  const { value, rerun } = useProbe(detectFeatures);
  const supported = value ? value.filter((feature) => feature.supported).length : 0;

  return (
    <ResultsPanel ready={value !== null} rows={8} onRerun={rerun}>
      {value && (
        <>
          <div className={extra.verdict}>
            <p className={extra.verdictTitle}>{supported} of {value.length} APIs exist in this browser</p>
            <p className={extra.verdictText}>A missing API is not a fault: browsers leave some out on purpose, for privacy or because they are still experimental.</p>
          </div>
          <ul className={extra.featureGrid} aria-label="Web platform APIs">
            {value.map((feature) => (
              <li key={feature.name} className={extra.featureItem}>
                <span className={extra.featureName}>{feature.name}</span>
                <span className={feature.supported ? extra.yes : extra.no}>{feature.supported ? "Present" : "Missing"}</span>
                {feature.note && <span className={extra.featureMeta}>{feature.note}</span>}
              </li>
            ))}
          </ul>
          <PanelNote>
            &quot;Present&quot; means the object or method exists. Some APIs still need your permission, a secure (HTTPS) page, or a
            site policy that allows them before they do anything.
          </PanelNote>
        </>
      )}
    </ResultsPanel>
  );
}
