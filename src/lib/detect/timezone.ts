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
