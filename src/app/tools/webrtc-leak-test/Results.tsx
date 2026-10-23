"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelNote, Verdict } from "@/components/tool/ResultsPanel";
import extra from "@/components/tool/results.module.css";
import { useProbe } from "@/components/tool/useProbe";
import { detectIP } from "@/lib/detect/ip";
import { detectWebRTCLeak } from "@/lib/detect/privacy";
import { describeIpRange } from "@/lib/ip";
import { compareWebRtcWithIp } from "@/lib/webrtc-compare";

const CANDIDATE_TYPES: Record<string, string> = {
  host: "host (this device)",
  srflx: "srflx (seen by STUN)",
  prflx: "prflx (seen by peer)",
  relay: "relay (TURN server)",
};

async function probe() {
  const [rtc, ip] = await Promise.all([detectWebRTCLeak(), detectIP()]);
  return { rtc, ip, comparison: compareWebRtcWithIp(rtc, ip) };
}

export default function Results() {
  const { value, rerun } = useProbe(probe);

  return (
    <ResultsPanel
      ready={value !== null}
      rows={6}
      onRerun={rerun}
      pendingLabel="Gathering ICE candidates through stun.cloudflare.com (up to 5 seconds)…"
    >
      {value && (
        <>
          <Verdict level={value.comparison.level} title={value.comparison.headline}>{value.comparison.detail}</Verdict>
          <DataRow label="WebRTC available" value={value.rtc.supported} />
          <DataRow label="IP this site sees" value={value.ip.ip ?? "Could not be determined"} />
          <DataRow label="Public addresses in candidates" value={value.rtc.publicIPs.join(", ") || "None"} />
          <DataRow label="Local addresses in candidates" value={value.rtc.privateIPs.join(", ") || "None"} />
          <DataRow label="Host addresses hidden by mDNS" value={value.rtc.mdnsProtected ? "Yes" : "No"} mono={false} />
          {value.rtc.addresses.length > 0 && (
            <div className={extra.tableWrap}>
              <table className={extra.table}>
                <caption>Every address-bearing candidate</caption>
                <thead>
                  <tr><th scope="col">Address</th><th scope="col">Type</th><th scope="col">Protocol</th><th scope="col">Range</th></tr>
                </thead>
                <tbody>
                  {value.rtc.addresses.map((candidate) => (
                    <tr key={`${candidate.address}-${candidate.candidateType}-${candidate.protocol}`}>
                      <td>{candidate.address}</td>
                      <td>{CANDIDATE_TYPES[candidate.candidateType] ?? candidate.candidateType}</td>
                      <td>{candidate.protocol}</td>
                      <td>{candidate.scope === "mdns" ? "mDNS name" : candidate.scope === "public" ? "Public" : describeIpRange(candidate.address) ?? candidate.scope}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <PanelNote>
            Running this test sends STUN requests from your browser to Cloudflare&apos;s public STUN server, which sees the
            address they come from. Nothing about the result is sent back to BrowserProbe.
          </PanelNote>
        </>
      )}
    </ResultsPanel>
  );
}
