"use client";

import { useEffect, useState } from "react";
import styles from "./TableOfContents.module.css";

interface ToCItem {
  text: string;
  id: string;
  level: number;
}

interface TableOfContentsProps {
  items: ToCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find entries that are intersecting
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Highlight the first visible entry
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px", // Focus area in viewport
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      items.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 90; // Header height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      
      // Update hash or state directly
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className={styles.tocNav}>
      <h4 className={styles.tocTitle}>Table of Contents</h4>
      <ul className={styles.tocList}>
        {items.map((item) => (
          <li
            key={item.id}
            className={`${styles.tocItem} ${
              item.level === 3 ? styles.indent : ""
            } ${activeId === item.id ? styles.active : ""}`}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={styles.tocLink}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
