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
      disabled: true,
    },
    {
      id: "gerenciar-turmas",
      icon: Users,
      title: "Gerenciar Turmas",
      description: "Organize e administre as turmas",
      page: "gerenciar-turmas",
      disabled: false,
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
                className={`flex flex-col overflow-hidden rounded-xl border-2 bg-white shadow-md transition-shadow ${
                  card.disabled 
                    ? 'border-gray-300 opacity-60 cursor-not-allowed' 
                    : 'border-[#B2D7EC] hover:shadow-lg'
                }`}
              >
                <div className="flex flex-1 flex-col items-center p-8 text-center">
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${
                    card.disabled ? 'bg-gray-200' : 'bg-[#B2D7EC]/20'
                  }`}>
                    <Icon className={`h-6 w-6 ${card.disabled ? 'text-gray-400' : 'text-[#0D4F97]'}`} strokeWidth={2} />
                  </div>
                  <h3 className={`mb-3 ${card.disabled ? 'text-gray-400' : 'text-[#0D4F97]'}`}>{card.title}</h3>
                  <p className={`${card.disabled ? 'text-gray-400' : 'text-[#222222]'}`}>{card.description}</p>
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => !card.disabled && onNavigate(card.page)}
                    disabled={card.disabled}
                    className={`flex h-12 w-full items-center justify-center rounded-lg px-4 text-center transition-all ${
                      card.disabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]'
                    }`}
                  >
                    {card.disabled ? 'Em Breve' : 'Acessar'}
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
