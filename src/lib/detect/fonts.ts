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

  const span = document.createElement("span");
  span.style.position = "absolute";
  span.style.left = "-9999px";
  span.style.fontSize = testSize;
  span.style.lineHeight = "normal";
  span.textContent = testStr;
  document.body.appendChild(span);

  try {
    const baseWidths: Record<string, number> = {};
    const baseHeights: Record<string, number> = {};

    for (const base of baseFonts) {
      span.style.fontFamily = base;
      baseWidths[base] = span.offsetWidth;
      baseHeights[base] = span.offsetHeight;
    }

    const detected: string[] = [];

    for (const font of TEST_FONTS) {
      let found = false;
      for (const base of baseFonts) {
        span.style.fontFamily = `"${font}", ${base}`;
        if (
          span.offsetWidth !== baseWidths[base] ||
          span.offsetHeight !== baseHeights[base]
        ) {
          found = true;
          break;
        }
      }
      if (found) detected.push(font);
    }

    return {
      detectedFonts: detected,
      totalTested: TEST_FONTS.length,
    };
  } finally {
    span.remove();
  }
}
