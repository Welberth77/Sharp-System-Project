import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import RankingCard from '../components/RankingCard';

// Dados de Simulação
const generateRanking = (currentUserMatricula) => {
    // 20 alunos com pontuações variadas
    const data = [
        { nome: 'Ana Carolina', pontuacao: 98500, matricula: 'M1003' },
        { nome: 'Bruno Fogaça', pontuacao: 95200, matricula: 'M1007' },
        { nome: 'Carla Dias', pontuacao: 94100, matricula: 'M1001' },
        { nome: 'Daniel Rocha', pontuacao: 93800, matricula: 'M1010' },
        { nome: 'Elisa Moraes', pontuacao: 92500, matricula: 'M1005' },
        { nome: 'Felipe Santos', pontuacao: 91900, matricula: 'M1008' },
        { nome: 'Gisele Lima', pontuacao: 90050, matricula: 'M1012' },
        { nome: 'Hugo Costa', pontuacao: 88700, matricula: 'M1015' },
        { nome: 'Ingrid Alves', pontuacao: 87500, matricula: 'M1018' },
        { nome: 'Julio Neto', pontuacao: 86900, matricula: 'M1002' },
        { nome: 'Karina Pires', pontuacao: 85000, matricula: 'M1004' },
        { nome: 'Luiz Fernando', pontuacao: 84300, matricula: 'M1006' },
        { nome: 'Mônica Souza', pontuacao: 83100, matricula: 'M1009' },
        { nome: 'Nuno Pereira', pontuacao: 82000, matricula: 'M1011' },
        { nome: '**VOCÊ (Aluno Atual)**', pontuacao: 7500, matricula: currentUserMatricula }, // Aluno Logado
        { nome: 'Otávio Martins', pontuacao: 78900, matricula: 'M1013' },
        { nome: 'Paula Gomes', pontuacao: 76500, matricula: 'M1014' },
        { nome: 'Rafaela Borges', pontuacao: 75200, matricula: 'M1016' },
        { nome: 'Sérgio Viana', pontuacao: 73000, matricula: 'M1017' },
        { nome: 'Tais Castro', pontuacao: 70000, matricula: 'M1019' },
    ];
    
    // 1. Ordena os alunos por pontuação
    const sortedData = data.sort((a, b) => b.pontuacao - a.pontuacao);
    
    // 2. Adiciona a posição ao objeto
    return sortedData.map((aluno, index) => ({
        ...aluno,
        posicao: index + 1
    }));
};

function RankingAlunos({ onNavigate, onLogout }) {
    
    // Simulação do aluno logado (a matricula é a chave de identificação)
    const currentUserMatricula = 'M1020'; 

    const rankingCompleto = generateRanking(currentUserMatricula);
    
    // Separa o Top 10
    const top10 = rankingCompleto.slice(0, 10);
    
    // Encontra os dados do aluno logado
    const alunoAtual = rankingCompleto.find(a => a.matricula === currentUserMatricula);
    
    // Verifica se o aluno logado está no Top 10
    const isCurrentUserInTop10 = alunoAtual && alunoAtual.posicao <= 10;

    return (
        <div className="flex min-h-screen bg-gray-100">
            
            <Sidebar onNavigate={onNavigate} currentPage="ranking" onLogout={onLogout} />
            
            <div className="flex-1 flex flex-col">
                
                <Header nameAluno="Aluno" /> 
                
                <main className="flex-1 p-8 overflow-y-auto">
                    
                    <h2 className="text-3xl font-bold text-[#283890] mb-8">
                        Ranking Geral de Alunos
                    </h2>

                    {/* Bloco de Aluno Atual (Exibido SE NÃO estiver no Top 10) */}
                    {!isCurrentUserInTop10 && alunoAtual && (
                        <div className="mb-8 p-6 rounded-xl bg-white shadow-xl border-t-4 border-blue-600">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                Sua Posição
                            </h3>
                            <RankingCard 
                                aluno={alunoAtual} 
                                isCurrentUser={true} 
                                isTop3={false} 
                            />
                            <p className="mt-4 text-sm text-gray-600">
                                Continue progredindo para alcançar o Top 10!
                            </p>
                        </div>
                    )}
                    
                    {/* Lista do Top 10 */}
                    <div className="bg-white p-6 rounded-xl shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            Top 10 Colocados
                        </h3>
                        
                        <div className="space-y-4">
                            {top10.map((aluno) => (
                                <RankingCard 
                                    key={aluno.matricula}
                                    aluno={aluno}
                                    isCurrentUser={aluno.matricula === currentUserMatricula}
                                    isTop3={aluno.posicao <= 3}
                                />
                            ))}
                        </div>
                    </div>
                    
                </main>
            </div>
        </div>
    );
}

export default RankingAlunos;