export interface TimezoneInfo {
  timezone: string;
  reportedTimezone: string;
  locale: string;
  utcOffset: string;
  language: string;
  languages: string;
  localTime: string;
}

const timezoneAliases: Record<string, string> = {
  "Asia/Calcutta": "Asia/Kolkata",
  "Asia/Katmandu": "Asia/Kathmandu",
  "Asia/Rangoon": "Asia/Yangon",
  "Asia/Saigon": "Asia/Ho_Chi_Minh",
  "Europe/Kiev": "Europe/Kyiv",
  "US/Eastern": "America/New_York",
  "US/Central": "America/Chicago",
  "US/Mountain": "America/Denver",
  "US/Pacific": "America/Los_Angeles",
};

export function canonicalizeTimezone(timezone: string): string {
  return timezoneAliases[timezone] || timezone || "Unknown";
}

export function formatUtcOffset(getTimezoneOffsetMinutes: number): string {
  if (!Number.isFinite(getTimezoneOffsetMinutes)) return "Unknown";

  const minutesEastOfUtc = -getTimezoneOffsetMinutes;
  const sign = minutesEastOfUtc >= 0 ? "+" : "-";
  const absoluteMinutes = Math.abs(minutesEastOfUtc);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;

  return `UTC${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function detectTimezone(now = new Date()): TimezoneInfo {
  const resolved = Intl.DateTimeFormat().resolvedOptions();
  const reportedTimezone = resolved.timeZone || "Unknown";
  const locale = resolved.locale || navigator.language || "Unknown";

  return {
    timezone: canonicalizeTimezone(reportedTimezone),
    reportedTimezone,
    locale,
    utcOffset: formatUtcOffset(now.getTimezoneOffset()),
    language: navigator.language || "Unknown",
    languages: navigator.languages?.join(", ") || navigator.language || "Unknown",
    localTime: new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "long",
    }).format(now),
  };
}

/** Minutes east of UTC for a time zone at a given moment, using Intl. Returns null for unknown zones. */
export function utcOffsetMinutes(timeZone: string, at = new Date()): number | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(at);
    const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
    const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
    return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60000);
  } catch {
    return null;
  }
}

export type TimezoneComparison = "same-zone" | "same-offset" | "different" | "unknown";

/** Compares the browser's time zone with the one an IP-geolocation database suggests. */
export function compareTimezones(browserZone: string, ipZone: string | null, at = new Date()): TimezoneComparison {
  if (!ipZone || !browserZone || browserZone === "Unknown") return "unknown";
  if (canonicalizeTimezone(browserZone) === canonicalizeTimezone(ipZone)) return "same-zone";
  const a = utcOffsetMinutes(browserZone, at);
  const b = utcOffsetMinutes(ipZone, at);
  if (a === null || b === null) return "unknown";
  return a === b ? "same-offset" : "different";
}
