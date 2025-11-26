"use client";

import ProfessionalForm from "../../components/ProfessionalForm";
import styles from "@/components/PageTheme.module.css";

export default function ProfissionaisPage() {
	return (
		<main className={styles.pageBg}>
			<div className={`${styles.container} ${styles.card}`}>
				<ProfessionalForm />
			</div>
		</main>
	);
}


