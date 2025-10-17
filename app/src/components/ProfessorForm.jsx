"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfessorForm.module.css";

const initialFormState = {
	name: "",
	email: "",
	phone: "",
	subject: "",
};

export default function ProfessorForm({ initialData, onSaved }) {
	const router = useRouter();
	const [form, setForm] = useState({ ...initialFormState, ...initialData });
	const [errors, setErrors] = useState({});

	function validate() {
		const validationErrors = {};
		if (!form.name?.trim()) validationErrors.name = "Nome é obrigatório";
		if (!form.email?.trim()) {
			validationErrors.email = "Email é obrigatório";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
			validationErrors.email = "Email inválido";
		}
		return validationErrors;
	}

	function handleChange(event) {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleCancel() {
		setForm(initialFormState);
		router.back();
	}

	function handleSubmit(event) {
		event.preventDefault();
		const validationErrors = validate();
		setErrors(validationErrors);
		if (Object.keys(validationErrors).length > 0) return;

		// Simula salvamento com dados falsos
		setTimeout(() => {
			alert("Professor salvo com sucesso!");
			setForm(initialFormState);
			onSaved?.(form);
		}, 200);
	}

	return (
		<div className={styles.pageContainer}>
			{/* Header com Logo APAE */}
			<div className={styles.header}>
				<div className={styles.logoContainer}>
					<div className={styles.logoImage}>
						<img src="/logo.APAE.jpg" alt="APAE" className={styles.logoImg} />
					</div>
				</div>
				<p className={styles.subtitle}>Preencha os dados do professor</p>
			</div>

			{/* Formulário */}
			<div className={styles.formContainer}>
				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.formGroup}>
						<label className={styles.label} htmlFor="name">Nome Completo</label>
						<input
							id="name"
							name="name"
							type="text"
							value={form.name}
							onChange={handleChange}
							className={styles.input}
							placeholder="Digite o Nome Completo"
						/>
						{errors.name && <span className={styles.error}>{errors.name}</span>}
					</div>

					<div className={styles.formGroup}>
						<label className={styles.label} htmlFor="email">Email</label>
						<div className={styles.inputWithIcon}>
							<input
								id="email"
								name="email"
								type="email"
								value={form.email}
								onChange={handleChange}
								className={styles.input}
								placeholder="professor@escola.com"
							/>
							<span className={styles.helpIcon}>?</span>
						</div>
						{errors.email && <span className={styles.error}>{errors.email}</span>}
					</div>

					<div className={styles.formGroup}>
						<label className={styles.label} htmlFor="subject">Disciplina</label>
						<input
							id="subject"
							name="subject"
							type="text"
							value={form.subject}
							onChange={handleChange}
							className={styles.input}
							placeholder="Disciplina"
						/>
					</div>

					<div className={styles.formGroup}>
						<label className={styles.label} htmlFor="phone">Telefone</label>
						<div className={styles.inputWithIcon}>
							<input
								id="phone"
								name="phone"
								type="tel"
								value={form.phone}
								onChange={handleChange}
								className={styles.input}
								placeholder="(83) 99999-9999"
							/>
							<span className={styles.helpIcon}>?</span>
						</div>
					</div>

					{/* Botões do formulário */}
					<div className={styles.formActions}>
						<button type="submit" className={styles.addButton}>
							Adicionar
						</button>
						<button type="button" onClick={handleCancel} className={styles.cancelButton}>
							Cancelar
						</button>
					</div>
				</form>
			</div>

			{/* Botão Voltar */}
			<div className={styles.backButtonContainer}>
				<button onClick={() => router.back()} className={styles.backButton}>
					Voltar
				</button>
			</div>
		</div>
	);
}


