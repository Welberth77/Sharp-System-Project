// Assets do react (não está sendo usado!)
import logo from '../assets/logo-sharpSystem.jpg'; 

const navItems = [
  { name: 'Home', link: '#', active: true },
  { name: 'Atividades', link: '#', active: false },
  { name: 'Ranking', link: '#', active: false },
  { name: 'Relatório de Desempenho', link: '#', active: false },
  { name: 'Comunicados', link: '#', active: false },
  { name: 'Pagamentos', link: '#', active: false },
  { name: 'Perfil do aluno', link: '#', active: false },
];

// O Sidebar agora só recebe a função de logout.
function Sidebar({ onLogout }) { 
  return (
    // Fundo azul escuro, altura total da tela, largura fixa
    <div className="flex h-screen w-64 flex-col justify-between bg-[#D9D9D9] text-white shadow-xl">
      <div>
        
        {/* Logo e Título */}
        <div className="flex items-center space-x-3 p-4">
          <img 
            src={logo} 
            alt="Sharp System Logo" 
            className="w-15 rounded-md" 
          />
          <span className="text-lg font-bold text-black">SHARP SYSTEM COURSE</span>
        </div>

        {/* Itens de Navegação (Apenas texto) */}
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = item.active;
            const linkClass = isActive
              ? 'bg-[#283890] shadow-lg text-white font-bold'
              : 'text-black hover:bg-[#283890] hover:text-white';

            return (
              <a
                key={item.name}
                href={item.link}
                // Adicionei pl-3 para compensar a falta do ícone
                className={`flex items-center rounded-lg p-3 pl-5 transition-colors duration-200 ${linkClass}`}
              >
                <span>{item.name}</span> 
              </a>
            );
          })}
        </nav>
      </div>

      {/* Botão Sair - CORRIGIDO: Usa a função onLogout */}
      <div className="p-4">
        <button 
          onClick={onLogout} // <--- Função de Logout chamada aqui
          className="flex w-full items-center justify-center space-x-3 rounded-lg bg-red-600 cursor-pointer p-3 font-bold transition-colors duration-200 hover:bg-red-700"
        >
          <span>SAIR</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;