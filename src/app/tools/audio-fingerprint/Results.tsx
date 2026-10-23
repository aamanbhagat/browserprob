"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { Verdict } from "@/components/tool/ResultsPanel";
import { useProbe } from "@/components/tool/useProbe";
import { detectAudio } from "@/lib/detect/audio";

export default function Results() {
  const { value, rerun } = useProbe(detectAudio);

  return (
    <ResultsPanel ready={value !== null} rows={4} onRerun={rerun} pendingLabel="Rendering a silent audio sample twice…">
      {value && !value.supported && (
        <Verdict level="info" title="Offline audio rendering is not available">
          This browser did not provide an OfflineAudioContext, so no audio sample could be produced.
        </Verdict>
      )}
      {value && value.supported && value.state === "timeout" && (
        <Verdict level="info" title="The render did not finish">
          The browser started the offline render but did not finish within two seconds. Some privacy modes stall or block it.
        </Verdict>
      )}
      {value && value.supported && value.state === "complete" && (
        <>
          {value.renders === "varies" ? (
            <Verdict level="ok" title="The two renders differ">
              Your browser altered the audio output between two identical renders, so a site cannot use this sample as a stable signal.
            </Verdict>
          ) : (
            <Verdict level="info" title="Both renders matched">
              Your browser produces the same audio output every time. Browsers of the same version on similar systems usually share
              this ID, so on its own it says little about you.
            </Verdict>
          )}
          <DataRow label="Sample ID (render 1)" value={value.fingerprint} />
          <DataRow label="Sample ID (render 2)" value={value.secondFingerprint} />
          <DataRow label="Sample rate used" value={`${value.sampleRate} Hz`} />
        </>
      )}
    </ResultsPanel>
  );
}
