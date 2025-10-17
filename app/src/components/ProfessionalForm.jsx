"use client";

import { useMemo, useState } from "react";
import styles from "./ProfessionalForm.module.css";
import { useRouter } from "next/navigation";

const defaultProfessional = {
	photo: null,
	code: "",
	name: "",
	socialName: "",
	cpf: "",
	birthDate: "",
	sex: "",
	race: "",
	nationality: "",
	originCountry: "",
	originState: "",
	originCity: "",
	nis: "",
	parent1: "",
	parent2: "",
	residentialZone: "",
	cep: "",
	address: "",
	number: "",
	complement: "",
	neighborhood: "",
	state: "",
	city: "",
	district: "",
	latitude: "",
	longitude: "",
	
	phoneType: "",
	phone: "",
	email: "",
	
	schooling: "",
	postGraduation: {
		specialization: false,
		master: false,
		doctorate: false,
	},
	communityTeacher: false,

	courses: {
		creche: false,
		preSchool: false,
		earlyElementary: false,
		finalElementary: false,
		highSchool: false,
		youthAdult: false,
		specialEducation: false,
		indigenousEducation: false,
		environmentalEducation: false,
		humanRights: false,
		ethnicRelations: false,
		fieldEducation: false,
		genderDiversity: false,
		childRights: false,
		otherCourses: false,
	},
	
	specialNeeds: [],
};

const tabs = ["Informações", "Documentos", "Matrículas", "Licenças/Afastamentos/Férias"];

export default function ProfessionalForm() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const [form, setForm] = useState(defaultProfessional);
	const [errors, setErrors] = useState({});
	const [newNeed, setNewNeed] = useState("");
  const [isCepLoading, setIsCepLoading] = useState(false);

	const postGradCount = useMemo(
		() => Object.values(form.postGraduation).filter(Boolean).length,
		[form.postGraduation]
	);

	function setField(name, value) {
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleFileChange(event) {
		const file = event.target.files?.[0] ?? null;
		setField("photo", file);
	}

	function handleChange(event) {
		const { name, value, type, checked } = event.target;
		if (name.startsWith("courses.")) {
			const key = name.split(".")[1];
			setForm((prev) => ({ ...prev, courses: { ...prev.courses, [key]: checked } }));
			return;
		}
		if (name.startsWith("postGraduation.")) {
			const key = name.split(".")[1];
			setForm((prev) => ({ ...prev, postGraduation: { ...prev.postGraduation, [key]: checked } }));
			return;
		}
		setField(name, type === "checkbox" ? checked : value);
	}

  // Masks and helpers
  function formatCPF(raw) {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatCEP(raw) {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    return digits.replace(/(\d{5})(\d)/, "$1-$2");
  }

  function formatPhoneBR(raw) {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  async function lookupCepAndFill(cepMasked) {
    const cep = cepMasked.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      setIsCepLoading(true);
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data && !data.erro) {
        setForm((prev) => ({
          ...prev,
          address: data.logradouro || prev.address,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
          district: data.distrito || prev.district,
        }));
      }
    } catch (e) {
    
    } finally {
      setIsCepLoading(false);
    }
  }

	function addNeed() {
		const value = newNeed.trim();
		if (!value) return;
		setForm((prev) => ({ ...prev, specialNeeds: [...prev.specialNeeds, value] }));
		setNewNeed("");
	}

	function removeNeed(index) {
		setForm((prev) => ({
			...prev,
			specialNeeds: prev.specialNeeds.filter((_, i) => i !== index),
		}));
	}

	function validate() {
		const v = {};
		if (!form.name.trim()) v.name = "Nome é obrigatório";
		if (!form.email.trim()) v.email = "Email é obrigatório";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) v.email = "Email inválido";
		if (!form.cpf.trim()) v.cpf = "CPF é obrigatório";
		return v;
	}

	function handleSave(event) {
		event.preventDefault();
		const v = validate();
		setErrors(v);
		if (Object.keys(v).length) return;
		alert("Profissional salvo com sucesso!");
		setForm(defaultProfessional);
	}

	function handleCancel() {
		setForm(defaultProfessional);
		router.back();
	}

	return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        {/* Header com Logo APAE */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/logo.APAE.jpg" 
              alt="APAE" 
              className="w-20 h-20" 
            />
          </div>
          <h2 className={styles.title}>Cadastrar Profissionais</h2>
        </div>

			{/* Tabs */}
            <div className={styles.tabs}>
				{tabs.map((t) => (
					<button
						key={t}
						onClick={() => setActiveTab(t)}
                        className={`${styles.tab} ${activeTab === t ? styles.tabActive : ""}`}
					>
						{t}
					</button>
				))}
			</div>

			{activeTab === "Informações" && (
                <form onSubmit={handleSave} className="space-y-8">
					{/* Foto + Identificação */}
                    <div className={`${styles.card} grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6`}>
						<div className="md:col-span-2 -mt-2 -mb-2">
                            <h2 className={styles.sectionTitle}>Informações</h2>
						</div>
						<div>
                            <div className={styles.avatarBox}>160 x 160</div>
							<input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
							<p className="text-xs text-gray-500 mt-1">(Máx. 200KB)</p>
						</div>
                        <div className={styles.grid3}>
							<div>
								<label className="block text-sm mb-1">Código</label>
								<input name="code" value={form.code} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div className="md:col-span-2">
								<label className="block text-sm mb-1">Nome</label>
								<input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
								{errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
							</div>
							<div className="md:col-span-1">
								<label className="block text-sm mb-1">Nome Social</label>
								<input name="socialName" value={form.socialName} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">CPF</label>
                <input
                  name="cpf"
                  value={form.cpf}
                  onChange={(e) => setField("cpf", formatCPF(e.target.value))}
                  className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition"
                  placeholder="000.000.000-00"
                />
								{errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>}
							</div>
							<div>
								<label className="block text-sm mb-1">Data de Nascimento</label>
								<input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">Sexo</label>
								<select name="sex" value={form.sex} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition">
									<option value="">Selecione</option>
									<option>Masculino</option>
									<option>Feminino</option>
								</select>
							</div>
							<div>
								<label className="block text-sm mb-1">Cor/Raça</label>
								<select name="race" value={form.race} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition">
									<option value="">Selecione</option>
									<option>Branca</option>
									<option>Preta</option>
									<option>Parda</option>
									<option>Amarela</option>
									<option>Indígena</option>
								</select>
							</div>
							<div>
								<label className="block text-sm mb-1">Nacionalidade</label>
								<input name="nationality" value={form.nationality} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">País de Origem</label>
								<input name="originCountry" value={form.originCountry} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">Estado de Origem</label>
								<input name="originState" value={form.originState} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">Município de Origem</label>
								<input name="originCity" value={form.originCity} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">NIS</label>
								<input name="nis" value={form.nis} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">Filiação 1</label>
								<input name="parent1" value={form.parent1} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">Filiação 2</label>
								<input name="parent2" value={form.parent2} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
						</div>
					</div>

					{/* Endereço */}
                    <div className={styles.card}>
                        <h2 className={styles.sectionTitle}>Endereço</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm mb-1">Zona Residencial</label>
								<select name="residentialZone" value={form.residentialZone} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition">
									<option value="">Selecione uma opção</option>
									<option>Urbana</option>
									<option>Rural</option>
								</select>
							</div>
							<div>
								<label className="block text-sm mb-1">CEP</label>
                <input
                  name="cep"
                  value={form.cep}
                  onChange={(e) => {
                    const masked = formatCEP(e.target.value);
                    setField("cep", masked);
                    lookupCepAndFill(masked);
                  }}
                  className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition"
                  placeholder="00000-000"
                />
							</div>
							<div className="md:col-span-1">
								<label className="block text-sm mb-1">Endereço</label>
								<input name="address" value={form.address} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" placeholder="Endereço" />
							</div>
							<div>
								<label className="block text-sm mb-1">Número</label>
								<input name="number" value={form.number} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" placeholder="Número" />
							</div>
							<div>
								<label className="block text-sm mb-1">Complemento</label>
								<input name="complement" value={form.complement} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" placeholder="Complemento" />
							</div>
							<div>
								<label className="block text-sm mb-1">Bairro</label>
								<input name="neighborhood" value={form.neighborhood} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" placeholder="Bairro" />
							</div>
							<div>
								<label className="block text-sm mb-1">Estado</label>
								<input name="state" value={form.state} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">Município</label>
								<input name="city" value={form.city} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">Distrito</label>
								<input name="district" value={form.district} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">Latitude</label>
								<input name="latitude" value={form.latitude} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
							<div>
								<label className="block text-sm mb-1">Longitude</label>
								<input name="longitude" value={form.longitude} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" />
							</div>
						</div>
					</div>

					{/* Contato e Educação */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={styles.card}>
                            <h2 className={styles.sectionTitle}>Contato</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm mb-1">Telefone</label>
									<div className="grid grid-cols-[140px_1fr] gap-2">
                  <select name="phoneType" value={form.phoneType} onChange={handleChange} className="border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition">
											<option value="">Outro</option>
											<option>Celular</option>
											<option>Fixo</option>
										</select>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setField("phone", formatPhoneBR(e.target.value))}
                    className="border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition"
                    placeholder="(00) 00000-0000"
                  />
									</div>
								</div>
								<div>
									<label className="block text-sm mb-1">E-mail</label>
									<input name="email" value={form.email} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition" placeholder="E-mail" />
									{errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
								</div>
							</div>
						</div>

                        <div className={styles.card}>
                            <h2 className={styles.sectionTitle}>Escolaridade</h2>
							<select name="schooling" value={form.schooling} onChange={handleChange} className="w-full border rounded-md p-2 bg-white/70 focus:ring-2 focus:ring-green-500/40 outline-none transition">
								<option value="">Selecione uma opção</option>
								<option>Ensino médio</option>
								<option>Graduação</option>
								<option>Licenciatura</option>
							</select>
							<div className="mt-4">
								<h3 className="font-medium mb-2">Pós-graduação ({postGradCount})</h3>
								<label className="mr-4"><input type="checkbox" name="postGraduation.specialization" checked={form.postGraduation.specialization} onChange={handleChange} className="mr-2"/>Especialização</label>
								<label className="mr-4"><input type="checkbox" name="postGraduation.master" checked={form.postGraduation.master} onChange={handleChange} className="mr-2"/>Mestrado</label>
								<label><input type="checkbox" name="postGraduation.doctorate" checked={form.postGraduation.doctorate} onChange={handleChange} className="mr-2"/>Doutorado</label>
							</div>
							<div className="mt-4">
								<label><input type="checkbox" name="communityTeacher" checked={form.communityTeacher} onChange={handleChange} className="mr-2"/>Professor Comunitário (Atividades Complementares)</label>
							</div>
						</div>
					</div>

					{/* Necessidades Especiais + Cursos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={styles.card}>
                            <h2 className={styles.sectionTitle}>Necessidades Especiais</h2>
							<div className="flex gap-2">
								<input value={newNeed} onChange={(e) => setNewNeed(e.target.value)} className="border rounded p-2 w-full" placeholder="Selecione/adicione uma opção" />
								<button type="button" onClick={addNeed} className="px-3 py-2 bg-gray-200 rounded">Adicionar</button>
							</div>
							<ul className="mt-2 space-y-1">
								{form.specialNeeds.map((n, i) => (
									<li key={`${n}-${i}`} className="flex justify-between items-center border rounded p-2">
										<span>{n}</span>
										<button type="button" onClick={() => removeNeed(i)} className="text-red-600 text-sm">Remover</button>
									</li>
								))}
							</ul>
						</div>
                        <div className={styles.card}>
                            <h2 className={styles.sectionTitle}>Outros cursos específicos</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
								<label><input type="checkbox" name="courses.creche" checked={form.courses.creche} onChange={handleChange} className="mr-2"/>Creche (0 a 3 anos)</label>
								<label><input type="checkbox" name="courses.preSchool" checked={form.courses.preSchool} onChange={handleChange} className="mr-2"/>Pré-escola (4 e 5 anos)</label>
								<label><input type="checkbox" name="courses.finalElementary" checked={form.courses.finalElementary} onChange={handleChange} className="mr-2"/>Anos finais do ensino fundamental</label>
								<label><input type="checkbox" name="courses.earlyElementary" checked={form.courses.earlyElementary} onChange={handleChange} className="mr-2"/>Anos iniciais do ensino fundamental</label>
								<label><input type="checkbox" name="courses.specialEducation" checked={form.courses.specialEducation} onChange={handleChange} className="mr-2"/>Educação especial</label>
								<label><input type="checkbox" name="courses.highSchool" checked={form.courses.highSchool} onChange={handleChange} className="mr-2"/>Ensino médio</label>
								<label><input type="checkbox" name="courses.environmentalEducation" checked={form.courses.environmentalEducation} onChange={handleChange} className="mr-2"/>Educação ambiental</label>
								<label><input type="checkbox" name="courses.indigenousEducation" checked={form.courses.indigenousEducation} onChange={handleChange} className="mr-2"/>Educação indígena</label>
								<label><input type="checkbox" name="courses.childRights" checked={form.courses.childRights} onChange={handleChange} className="mr-2"/>Direitos de criança e adolescente</label>
								<label><input type="checkbox" name="courses.humanRights" checked={form.courses.humanRights} onChange={handleChange} className="mr-2"/>Educação em direitos humanos</label>
								<label><input type="checkbox" name="courses.ethnicRelations" checked={form.courses.ethnicRelations} onChange={handleChange} className="mr-2"/>Relações étnico-raciais</label>
								<label><input type="checkbox" name="courses.fieldEducation" checked={form.courses.fieldEducation} onChange={handleChange} className="mr-2"/>Educação do campo</label>
								<label><input type="checkbox" name="courses.genderDiversity" checked={form.courses.genderDiversity} onChange={handleChange} className="mr-2"/>Gênero e diversidade sexual</label>
								<label><input type="checkbox" name="courses.otherCourses" checked={form.courses.otherCourses} onChange={handleChange} className="mr-2"/>Outros</label>
							</div>
						</div>
					</div>

					{/* Ações */}
                    <div className={styles.actions}>
                        <button type="submit" className={styles.primaryBtn}>Salvar Profissional</button>
                        <button type="button" onClick={handleCancel} className={styles.secondaryBtn}>Cancelar</button>
					</div>
				</form>
			)}

			{activeTab !== "Informações" && (
				<div className="text-gray-600">Esta aba será implementada posteriormente.</div>
			)}
		</div>
	</div>
	);
}


