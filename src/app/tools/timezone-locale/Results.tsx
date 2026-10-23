"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelGroup, PanelNote } from "@/components/tool/ResultsPanel";
import { useProbe } from "@/components/tool/useProbe";
import { detectIP } from "@/lib/detect/ip";
import { compareTimezones, detectTimezone } from "@/lib/detect/timezone";

const COMPARISON_TEXT = {
  "same-zone": "Same time zone",
  "same-offset": "Different zone name, same UTC offset right now",
  different: "Different UTC offset",
  unknown: "Not available",
} as const;

async function probe() {
  const now = new Date();
  const resolved = Intl.DateTimeFormat().resolvedOptions();
  const ip = await detectIP();
  const timezone = detectTimezone(now);
  return {
    ...timezone,
    dateFormat: now.toLocaleDateString(),
    timeFormat: now.toLocaleTimeString(),
    numberFormat: (1234567.891).toLocaleString(),
    calendar: resolved.calendar || "gregory",
    numberingSystem: resolved.numberingSystem || "latn",
    hourCycle: new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions().hourCycle ?? "Not reported",
    ipTimezone: ip.location?.timezone ?? null,
    comparison: compareTimezones(timezone.reportedTimezone, ip.location?.timezone ?? null, now),
  };
}

export default function Results() {
  const { value, rerun } = useProbe(probe);

  return (
    <ResultsPanel ready={value !== null} rows={10} onRerun={rerun}>
      {value && (
        <>
          <PanelGroup title="Time">
            <DataRow label="Time zone" value={value.timezone} />
            {value.reportedTimezone !== value.timezone && <DataRow label="Name as reported" value={value.reportedTimezone} />}
            <DataRow label="UTC offset now" value={value.utcOffset} />
            <DataRow label="Local time" value={value.localTime} mono={false} />
            <DataRow label="Time zone of your IP address" value={value.ipTimezone ?? "Not available"} />
            <DataRow label="Browser vs IP time zone" value={COMPARISON_TEXT[value.comparison]} mono={false} />
          </PanelGroup>
          <PanelGroup title="Language and formatting">
            <DataRow label="Formatting locale" value={value.locale} />
            <DataRow label="Preferred languages" value={value.languages} />
            <DataRow label="Date format" value={value.dateFormat} />
            <DataRow label="Time format" value={value.timeFormat} />
            <DataRow label="Number format" value={value.numberFormat} />
            <DataRow label="Hour cycle" value={value.hourCycle} />
            <DataRow label="Calendar" value={value.calendar} />
            <DataRow label="Numbering system" value={value.numberingSystem} />
          </PanelGroup>
          {value.comparison === "different" && (
            <PanelNote>
              Your browser&apos;s clock and the location of your IP address are in different UTC offsets. That is expected when you
              use a VPN, travel, or your ISP routes traffic through another region, and some sites treat it as a sign of a proxy.
            </PanelNote>
          )}
        </>
      )}
    </ResultsPanel>
  );
}
