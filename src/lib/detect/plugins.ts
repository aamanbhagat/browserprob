// Since 2022 the HTML standard hard-codes navigator.plugins: five PDF viewer entries when the browser can
// display PDFs inline, otherwise an empty list. https://developer.mozilla.org/en-US/docs/Web/API/Navigator/plugins
export const STANDARD_PDF_PLUGINS = [
  "PDF Viewer",
  "Chrome PDF Viewer",
  "Chromium PDF Viewer",
  "Microsoft Edge PDF Viewer",
  "WebKit built-in PDF",
] as const;

export type PluginListKind = "standard-pdf-list" | "empty" | "non-standard";

export function classifyPluginList(names: string[]): PluginListKind {
  if (names.length === 0) return "empty";
  const standard = new Set<string>(STANDARD_PDF_PLUGINS);
  return names.length === STANDARD_PDF_PLUGINS.length && names.every((name) => standard.has(name)) ? "standard-pdf-list" : "non-standard";
}

export interface PluginInfo {
  plugins: string[];
  mimeTypes: string[];
  /** navigator.pdfViewerEnabled, or null where the property does not exist. */
  pdfViewerEnabled: boolean | null;
  kind: PluginListKind;
}

export function detectPlugins(): PluginInfo {
  const plugins = Array.from(navigator.plugins || [], (plugin) => plugin.name);
  const mimeTypes = Array.from(navigator.mimeTypes || [], (mime) => mime.type);
  return {
    plugins,
    mimeTypes: [...new Set(mimeTypes)],
    pdfViewerEnabled: typeof navigator.pdfViewerEnabled === "boolean" ? navigator.pdfViewerEnabled : null,
    kind: classifyPluginList(plugins),
  };
}
