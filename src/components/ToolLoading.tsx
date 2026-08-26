import ProbeAnimation from "@/components/ProbeAnimation";
import styles from "@/app/tools/tools.module.css";

export default function ToolLoading({ title }: { title: string }) {
  return (
    <div className={styles.toolPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>Preparing this browser check and collecting the available signals.</p>
        </div>
        <ProbeAnimation />
      </div>
    </div>
  );
}
