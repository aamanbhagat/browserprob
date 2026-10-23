import Link from "next/link";
import type { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";
import { headingId } from "@/lib/markdown-text";
import styles from "./Markdown.module.css";

export { contentBlocks, extractHeadings, headingId, stripInlineMarkdown } from "@/lib/markdown-text";

// A deliberately small Markdown subset used by the guides and tool pages:
// paragraphs, ## / ### headings, - and 1. lists, > quotes, ``` code fences,
// and inline **bold**, `code` and [links](url).

export function renderInline(text: string): ReactNode[] {
  const tokenRegex = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
    const [, , boldText, codeText, linkText, linkUrl] = match;

    if (boldText !== undefined) {
      parts.push(<strong key={match.index}>{boldText}</strong>);
    } else if (codeText !== undefined) {
      parts.push(<code key={match.index} className={styles.inlineCode}>{codeText}</code>);
    } else if (linkText !== undefined && linkUrl !== undefined) {
      parts.push(
        linkUrl.startsWith("/") ? (
          <Link key={match.index} href={linkUrl} className={styles.link}>{linkText}</Link>
        ) : (
          <a key={match.index} href={linkUrl} className={styles.link} rel="noopener noreferrer">{linkText}</a>
        ),
      );
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return parts.length > 0 ? parts : [text];
}

export function renderBlocks(content: string): ReactNode[] {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(<CodeBlock key={`code-${i}`} code={codeLines.join("\n")} language={language} />);
      continue;
    }

    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) quote.push(lines[i++].slice(2));
      elements.push(
        <blockquote key={`quote-${i}`} className={styles.blockquote}>
          {quote.map((item, index) => <p key={index}>{renderInline(item)}</p>)}
        </blockquote>,
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) items.push(lines[i++].slice(2));
      elements.push(
        <ul key={`ul-${i}`} className={styles.ul}>
          {items.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) items.push(lines[i++].replace(/^\d+\.\s/, ""));
      elements.push(
        <ol key={`ol-${i}`} className={styles.ol}>
          {items.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
        </ol>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      elements.push(<h3 key={`h3-${i}`} id={headingId(text)} className={styles.h3}>{text}</h3>);
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      elements.push(<h2 key={`h2-${i}`} id={headingId(text)} className={styles.h2}>{text}</h2>);
      i++;
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    elements.push(<p key={`p-${i}`} className={styles.p}>{renderInline(line)}</p>);
    i++;
  }

  return elements;
}

export default function Markdown({ content, className }: { content: string; className?: string }) {
  return <div className={`${styles.prose} ${className ?? ""}`}>{renderBlocks(content)}</div>;
}
