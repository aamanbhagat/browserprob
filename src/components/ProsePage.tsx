import type { ReactNode } from "react";
import { formatDate } from "@/lib/site";
import styles from "./ProsePage.module.css";

interface ProsePageProps {
  title: string;
  intro?: ReactNode;
  updated?: string;
  children: ReactNode;
}

export default function ProsePage({ title, intro, updated, children }: ProsePageProps) {
  return (
    <article className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {intro && <p className={styles.intro}>{intro}</p>}
        {updated && (
          <p className={styles.updated}>
            Last updated <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
        )}
      </header>
      <div className={styles.body}>{children}</div>
    </article>
  );
}

/** Shows owner details, or a clearly marked placeholder while they are still TODO. */
export function OwnerDetail({ value, href }: { value: string; href?: string }) {
  if (value.startsWith("TODO(owner)")) return <span className={styles.placeholder}>{value}</span>;
  return href ? <a href={href}>{value}</a> : <>{value}</>;
}
