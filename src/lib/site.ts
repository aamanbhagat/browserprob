export const SITE_URL = "https://browserprobe.app";
export const SITE_NAME = "BrowserProbe";
export const SOURCE_URL = "https://github.com/aamanbhagat/browserprob";
export const ISSUES_URL = `${SOURCE_URL}/issues`;

// TODO(owner): replace both placeholders before deploying. They appear on /about and /contact.
export const OWNER_NAME = "TODO(owner): site owner's name";
export const CONTACT_EMAIL = "TODO(owner): contact email";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
