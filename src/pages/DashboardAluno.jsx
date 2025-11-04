// Componentes importados
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';

function DashboardAluno({ onNavigate, onLogout, currentPage }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
  <Sidebar onNavigate={onNavigate} currentPage={currentPage || "dashboard"} onLogout={onLogout} />

      <div className="flex-1 flex flex-col">
        <Header studentName="JOÃO SILVA" />


        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-10">
            <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">PROGRESSO 83%</h2>
            <div className="h-3 rounded-full bg-gray-300">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-700"
                style={{ width: "83%" }}
                role="progressbar"
                aria-valuenow="83"
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
            
            {/* 3. Card: Pontuação Total - Ícone removido */}
            <DashboardCard 
              title="Pontuação Total" 
              value="1250 Pontos" 
              // icon={HiTrophy} <-- Removido
              colorClass="text-yellow-500"
            />
            
            {/* 3. Card: Próxima Atividade - Ícone removido */}
            <DashboardCard 
              title="Próxima Atividade" 
              value="Unit 21" 
              colorClass="text-blue-600"
            />

          </div>

          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">Status de Pagamento</h3>


            <ul className="space-y-3 text-lg font-medium">
              <li className="flex items-center text-red-600">
                <span>Outubro/2025: Pendente</span>
              </li>


              <li className="flex items-center text-green-600">
                <span>Setembro/2025: Em dia</span>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
  
}

export default DashboardAluno;

