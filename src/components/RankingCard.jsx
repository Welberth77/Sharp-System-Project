// Ajuste o caminho da logo se necessário
import logo from '../assets/logo-sharpSystem.jpg'; 

// Componente para um card de posição no ranking
function RankingCard({ aluno, isCurrentUser, isTop3 }) {
  
  // Define o estilo de destaque para Pódio e Aluno Logado
  let cardClass = "bg-gray-100 border-l-4 border-gray-200";
  let positionClass = "text-gray-500";

  if (isCurrentUser) {
    cardClass = "bg-blue-50 border-l-4 border-blue-600 shadow-md";
    positionClass = "text-blue-600 font-bold";
  } else if (isTop3) {
    if (aluno.posicao === 1) {
        cardClass = "bg-yellow-50 border-l-4 border-yellow-500 shadow-lg";
        positionClass = "text-yellow-500 text-3xl font-extrabold";
    } else if (aluno.posicao === 2) {
        cardClass = "bg-gray-100 border-l-4 border-slate-400 shadow-md";
        positionClass = "text-gray-400 text-2xl font-bold";
    } else if (aluno.posicao === 3) {
        cardClass = "bg-yellow-50 border-l-4 border-yellow-700 shadow";
        positionClass = "text-yellow-700 text-xl font-bold";
    }
  }

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${cardClass}`}>
      
      {/* Posição */}
      <div className={`w-1/6 flex justify-center items-center ${positionClass}`}>
        #{aluno.posicao}
      </div>

      {/* Nome e Avatar (Logo como avatar) */}
      <div className="flex items-center space-x-4 w-3/6">
        <img 
            src={logo} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300" 
        />
        <span className={`text-lg font-medium ${isCurrentUser ? 'text-blue-700' : 'text-gray-800'}`}>
          {aluno.nome}
        </span>
      </div>

      {/* Pontuação */}
      <div className="w-2/6 text-right">
        <span className="text-xl font-extrabold text-[#283890]">
          {aluno.pontuacao.toLocaleString('pt-BR')}
        </span>
        <span className="text-sm text-gray-500 ml-1">pts</span>
      </div>
    </div>
  );
}

export default RankingCard;