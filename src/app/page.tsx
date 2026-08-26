import HomeDashboard from "@/components/HomeDashboard";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.homePage} data-home-dashboard>
      <HomeDashboard />
    </div>
  );
}
