"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelNote, Verdict } from "@/components/tool/ResultsPanel";
import { useProbe } from "@/components/tool/useProbe";
import { countryName, detectIP, type IPInfo } from "@/lib/detect/ip";

function locationText(info: IPInfo): string | null {
  if (!info.location) return null;
  const { city, region, country } = info.location;
  return [city, region, countryName(country)].filter(Boolean).join(", ") || null;
}

export default function Results() {
  const { value, rerun } = useProbe(detectIP);
  const location = value ? locationText(value) : null;

  return (
    <ResultsPanel ready={value !== null} rows={4} onRerun={rerun} pendingLabel="Asking this site's server which address your request came from…">
      {value && value.status === "unavailable" && (
        <Verdict level="info" title="Your address could not be determined">
          The request to this site&apos;s IP endpoint failed or timed out. A network filter or browser extension may be blocking it. Try again.
        </Verdict>
      )}
      {value && value.status === "ok" && (
        <>
          <DataRow label="IP address" value={value.ip} />
          <DataRow label="Address family" value={value.version ? `IPv${value.version}` : "Unknown"} mono={false} />
          <DataRow label="Address type" value={value.scope === "public" ? "Public (globally routable)" : value.rangeLabel ?? value.scope} mono={false} />
          {location && <DataRow label="Approximate location" value={location} mono={false} />}
          {value.location?.timezone && <DataRow label="Time zone for this IP" value={value.location.timezone} />}
          {value.scope !== "public" && (
            <PanelNote>
              This is not a public internet address. You are probably running BrowserProbe on your own machine or behind a proxy
              that does not pass your address on. On the public site, this row shows the address your ISP, VPN or proxy uses.
            </PanelNote>
          )}
          <PanelNote>
            One request travels over either IPv4 or IPv6, so only one address family can be shown. If your connection has both,
            the other address is not visible here. Location comes from our host&apos;s IP database and is often wrong for VPNs and mobile networks.
          </PanelNote>
        </>
      )}
    </ResultsPanel>
  );
}
