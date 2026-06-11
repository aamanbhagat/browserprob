import styles from "./ProbeAnimation.module.css";

export default function ProbeAnimation() {
  return (
    <div className={styles.container} role="status" aria-label="Scanning browser...">
      <div className={styles.radar}>
        <div className={styles.sweep} />
        <div className={styles.ring1} />
        <div className={styles.ring2} />
        <div className={styles.ring3} />
        <div className={styles.dot} />
      </div>
      <p className={styles.text}>Probing your browser<span className={styles.dots}>...</span></p>
    </div>
  );
}
