"use client";

import { useState } from "react";
import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelNote, Verdict } from "@/components/tool/ResultsPanel";
import extra from "@/components/tool/results.module.css";
import { useProbe } from "@/components/tool/useProbe";
import { listMediaDevices, MEDIA_ERROR_MESSAGES, revealDeviceLabels, type MediaDevicesInfo } from "@/lib/detect/media";

const KIND_NAMES: Record<MediaDeviceKind, string> = {
  audioinput: "Microphone",
  audiooutput: "Speaker or headphones",
  videoinput: "Camera",
};

export default function Results() {
  const { value: listed, rerun } = useProbe(listMediaDevices);
  const [revealed, setRevealed] = useState<MediaDevicesInfo | null>(null);
  const [asking, setAsking] = useState(false);
  const value = revealed ?? listed;

  const reveal = async () => {
    if (!value) return;
    setAsking(true);
    setRevealed(await revealDeviceLabels(value));
    setAsking(false);
  };

  return (
    <ResultsPanel ready={value !== null} rows={5} onRerun={() => { setRevealed(null); rerun(); }}>
      {value && !value.supported && (
        <Verdict level="info" title="Not supported in this browser">
          navigator.mediaDevices is unavailable. It only exists on secure (HTTPS) pages, and some browsers or policies remove it.
        </Verdict>
      )}
      {value && value.supported && (
        <>
          <DataRow label="Cameras" value={value.counts.videoinput} />
          <DataRow label="Microphones" value={value.counts.audioinput} />
          <DataRow label="Speakers or headphones" value={value.counts.audiooutput} />
          {value.devices.length > 0 && (
            <div className={extra.tableWrap}>
              <table className={extra.table}>
                <caption>What this page can see for each device</caption>
                <thead>
                  <tr><th scope="col">Kind</th><th scope="col">Name</th><th scope="col">Device ID</th></tr>
                </thead>
                <tbody>
                  {value.devices.map((device, index) => (
                    <tr key={`${device.kind}-${index}`}>
                      <td>{KIND_NAMES[device.kind]}</td>
                      <td>{device.label || <em>Hidden until you grant permission</em>}</td>
                      <td>{device.hasDeviceId ? "Exposed" : "Hidden"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!value.labelsVisible && (
            <div className={extra.actions}>
              <button type="button" className={extra.actionButton} onClick={reveal} disabled={asking}>
                {asking ? "Waiting for your answer…" : "Show device names"}
              </button>
              <p className={extra.actionHint}>
                Your browser will ask for camera and/or microphone access. The devices are switched off again immediately;
                nothing is recorded, shown or sent anywhere.
              </p>
            </div>
          )}
          {value.error && <PanelNote>{MEDIA_ERROR_MESSAGES[value.error] ?? `The browser reported ${value.error}.`}</PanelNote>}
        </>
      )}
    </ResultsPanel>
  );
}
