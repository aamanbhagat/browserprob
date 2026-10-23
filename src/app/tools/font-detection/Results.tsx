"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelNote } from "@/components/tool/ResultsPanel";
import extra from "@/components/tool/results.module.css";
import { useProbe } from "@/components/tool/useProbe";
import { detectFonts, TEST_FONTS } from "@/lib/detect/fonts";

export default function Results() {
  const { value, rerun } = useProbe(detectFonts);
  const missing = value ? TEST_FONTS.filter((font) => !value.detectedFonts.includes(font)) : [];

  return (
    <ResultsPanel ready={value !== null} rows={3} onRerun={rerun}>
      {value && (
        <>
          <DataRow label="Distinguishable font names" value={`${value.detectedFonts.length} of ${value.totalTested}`} mono={false} />
          <ul className={extra.featureGrid} aria-label="Detected fonts">
            {value.detectedFonts.map((font) => (
              <li key={font} className={extra.featureItem}>
                <span className={extra.featureName} style={{ fontFamily: `"${font}", sans-serif` }}>{font}</span>
                <span className={extra.yes}>Detected</span>
              </li>
            ))}
          </ul>
          {missing.length > 0 && (
            <details className={extra.details}>
              <summary>Not distinguishable ({missing.length})</summary>
              <p className={extra.monoList}>{missing.join(", ")}</p>
            </details>
          )}
          <PanelNote>
            &quot;Detected&quot; means text in that font measured differently from the browser&apos;s fallback fonts. It does not prove
            the font file is installed, and browsers that restrict fonts will report fewer names.
          </PanelNote>
        </>
      )}
    </ResultsPanel>
  );
}
