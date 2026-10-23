"use client";

import ResultsPanel from "@/components/tool/ResultsPanel";
import extra from "@/components/tool/results.module.css";
import { useProbe } from "@/components/tool/useProbe";
import { detectJsFeatures, newestCompleteEdition } from "@/lib/detect/js-features";

export default function Results() {
  const { value, rerun } = useProbe(detectJsFeatures);
  const newest = value ? newestCompleteEdition(value) : null;
  const supported = value ? value.filter((feature) => feature.supported).length : 0;

  return (
    <>
      {/* Server-rendered answer. JavaScript replaces it as soon as it runs; with JavaScript off it stays. */}
      {value === null && (
        <div className={extra.verdict}>
          <p className={extra.verdictTitle}>Checking whether JavaScript runs…</p>
          <p className={extra.verdictText}>
            If this message does not change within a few seconds, JavaScript is turned off or blocked in this browser.
          </p>
        </div>
      )}
      <ResultsPanel ready={value !== null} rows={6} onRerun={rerun} pendingLabel="Waiting for JavaScript to run…">
        {value && (
          <>
            <p className={extra.jsState}><strong>Yes, JavaScript is enabled.</strong> This answer was written by JavaScript running in your browser.</p>
            <div className={extra.verdict}>
              <p className={extra.verdictTitle}>{supported} of {value.length} modern built-ins supported</p>
              <p className={extra.verdictText}>
                {newest ? `Everything listed up to ${newest} is available.` : "Some ES2015 features are missing, which suggests a very old or restricted engine."}
              </p>
            </div>
            <ul className={extra.featureGrid} aria-label="JavaScript built-ins">
              {value.map((feature) => (
                <li key={feature.name} className={extra.featureItem}>
                  <span className={extra.featureName}>{feature.name}</span>
                  <span className={feature.supported ? extra.yes : extra.no}>{feature.supported ? "Yes" : "No"}</span>
                  <span className={extra.featureMeta}>{feature.edition}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </ResultsPanel>
    </>
  );
}
