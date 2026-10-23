// Plain-text helpers for the Markdown subset used in guides and tool pages (see src/components/Markdown.tsx).

export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function extractHeadings(content: string): { text: string; id: string; level: 2 | 3 }[] {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## ") || line.startsWith("### "))
    .map((line) => {
      const level = line.startsWith("### ") ? 3 : 2;
      const text = line.slice(level + 1).trim();
      return { text, id: headingId(text), level };
    });
}

/** Plain text for structured data and meta tags: drops inline Markdown syntax. */
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
}

/** Paragraphs and list items without their Markdown markers, outside code fences. */
export function contentBlocks(content: string): string[] {
  const blocks: string[] = [];
  let inFence = false;
  for (const line of content.split("\n")) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const text = line.replace(/^(#{2,3} |- |\d+\. |> )/, "").trim();
    if (text) blocks.push(text);
  }
  return blocks;
}
