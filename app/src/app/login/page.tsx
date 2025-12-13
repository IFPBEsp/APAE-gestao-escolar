'use client';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      {/* Header com Logo APAE */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-white shadow-lg">
            <img src="/logo.APAE.jpg" alt="APAE" className="w-full h-full object-cover" />
          </div>
        </div>
        <p className="text-base md:text-lg text-gray-700 font-medium">Sistema de Gestão Escolar</p>
      </div>

      {/* Formulário de Login */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0D4F97] mb-4">Login</h2>
          <p className="text-gray-600 text-center mb-8 text-sm md:text-base">Essa página ainda está em construção.</p>
          <div className="text-center">
            <button
              onClick={() => window.history.back()} 
              className="w-full md:w-auto bg-[#0D4F97] hover:bg-[#FFD000] hover:text-[#0D4F97] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
