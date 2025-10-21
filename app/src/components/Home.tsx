import { UserPlus, Users } from "lucide-react";

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const cards = [
    {
      id: "cadastrar-professor",
      icon: UserPlus,
      title: "Cadastrar Professor",
      description: "Adicione e gerencie professores do sistema",
      page: "cadastrar-professor",
    },
    {
      id: "gerenciar-turmas",
      icon: Users,
      title: "Gerenciar Turmas",
      description: "Organize e administre as turmas",
      page: "gerenciar-turmas",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="flex flex-col overflow-hidden rounded-xl border-2 border-[#B2D7EC] bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                    <Icon className="h-6 w-6 text-[#0D4F97]" strokeWidth={2} />
                  </div>
                  <h3 className="mb-3 text-[#0D4F97]">{card.title}</h3>
                  <p className="text-[#222222]">{card.description}</p>
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onNavigate(card.page)}
                    className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0D4F97] px-4 text-center text-white transition-all hover:bg-[#FFD000] hover:text-[#0D4F97]"
                  >
                    Acessar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
