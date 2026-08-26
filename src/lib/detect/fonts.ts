const TEST_FONTS = [
  "Arial", "Arial Black", "Calibri", "Cambria", "Century Gothic",
  "Comic Sans MS", "Consolas", "Courier New", "Georgia", "Helvetica",
  "Impact", "Lucida Console", "Lucida Sans Unicode", "Monaco",
  "Palatino Linotype", "Segoe UI", "Tahoma", "Times New Roman",
  "Trebuchet MS", "Verdana", "Menlo", "Fira Code", "JetBrains Mono",
  "Source Code Pro", "Ubuntu", "Roboto", "Open Sans", "Lato",
  "Montserrat", "Oswald", "Raleway", "Playfair Display",
  "Noto Sans", "Noto Serif", "Garamond", "Book Antiqua",
  "Franklin Gothic Medium", "Gill Sans", "Candara", "Optima",
];

export interface FontInfo {
  detectedFonts: string[];
  totalTested: number;
}

export function detectFonts(): FontInfo {
  const baseFonts = ["monospace", "sans-serif", "serif"];
  const testStr = "mmmmmmmmmmlli";
  const testSize = "72px";

  const createProbe = (fontFamily: string): HTMLSpanElement => {
    const probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.left = "-9999px";
    probe.style.fontFamily = fontFamily;
    probe.style.fontSize = testSize;
    probe.style.lineHeight = "normal";
    probe.style.whiteSpace = "nowrap";
    probe.textContent = testStr;
    return probe;
  };

  const fragment = document.createDocumentFragment();
  const baseProbes = new Map<string, HTMLSpanElement>();
  const fontProbes = new Map<string, HTMLSpanElement[]>();

  for (const base of baseFonts) {
    const probe = createProbe(base);
    baseProbes.set(base, probe);
    fragment.appendChild(probe);
  }

  for (const font of TEST_FONTS) {
    const probes = baseFonts.map((base) => createProbe(`"${font}", ${base}`));
    fontProbes.set(font, probes);
    fragment.append(...probes);
  }

  document.body.appendChild(fragment);

  try {
    const baseMetrics = new Map(
      baseFonts.map((base) => {
        const probe = baseProbes.get(base)!;
        return [base, { width: probe.offsetWidth, height: probe.offsetHeight }] as const;
      }),
    );

    const detected = TEST_FONTS.filter((font) =>
      fontProbes.get(font)!.some((probe, index) => {
        const baseline = baseMetrics.get(baseFonts[index])!;
        return probe.offsetWidth !== baseline.width || probe.offsetHeight !== baseline.height;
      }),
    );

    return {
      detectedFonts: detected,
      totalTested: TEST_FONTS.length,
    };
  } finally {
    for (const probe of baseProbes.values()) probe.remove();
    for (const probes of fontProbes.values()) {
      for (const probe of probes) probe.remove();
    }
  }
}
