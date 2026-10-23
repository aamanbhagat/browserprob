export interface ContentSection {
  /** Stable anchor id. */
  id: string;
  heading: string;
  /** Markdown subset rendered by src/components/Markdown.tsx. */
  body: string;
}

export interface FaqItem {
  question: string;
  /** Plain sentences; inline Markdown links are allowed and stripped for structured data. */
  answer: string;
}

export interface SourceLink {
  title: string;
  url: string;
}

export interface ToolContent {
  sections: ContentSection[];
  faq: FaqItem[];
  sources: SourceLink[];
}
