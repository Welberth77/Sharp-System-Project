"use client"

import logo from "../assets/Logo-SharpSystem.jpg"
import { usePermissions } from "../hooks/usePermissions"

function Sidebar({ onNavigate, currentPage, onLogout }) {
  const { canAccessProfessors, isAluno, isResponsavel, userRole } = usePermissions()

  // Menu items base para todos os usuários
  const baseNavItems = [
    { name: "Home", page: "dashboard", active: currentPage === "dashboard" },
  ]

  // Menu items para alunos
  const alunoNavItems = [
    { name: "Atividades", page: "atividades", active: currentPage === "atividades" },
    { name: "Ranking", page: "ranking", active: currentPage === "ranking" },
    { name: "Perfil do aluno", page: "perfil", active: currentPage === "perfil" },
  ]

  // Menu items administrativos
  const adminNavItems = [
    { name: "Relatório de Desempenho", page: "relatorio", active: currentPage === "relatorio" },
    { name: "Comunicados", page: "comunicados", active: currentPage === "comunicados" },
    { name: "Pagamentos", page: "pagamentos", active: currentPage === "pagamentos" },
  ]

  // Menu items para gestão
  const gestaoNavItems = []
  
  if (canAccessProfessors()) {
    gestaoNavItems.push({
      name: "Gestão de Professores", 
      page: "professores", 
      active: currentPage === "professores"
    })
  }

  // Construir o menu final baseado na role
  let navItems = [...baseNavItems]
  
  if (isAluno()) {
    navItems = [...navItems, ...alunoNavItems]
  } else if (isResponsavel()) {
    // Responsáveis podem ver algumas informações dos alunos
    navItems = [...navItems, ...alunoNavItems.filter(item => 
      item.page !== "atividades" // Responsáveis não fazem atividades
    )]
  } else {
    // Outros roles (admin, coordenador, secretaria, professor)
    navItems = [...navItems, ...adminNavItems, ...gestaoNavItems]
  }

  return (
    <div className="flex h-screen w-64 flex-col justify-between bg-[#D9D9D9] text-white shadow-xl">
      <div>
        <div className="flex items-center space-x-3 p-4">
          <img src={logo || "/placeholder.svg"} alt="Sharp System Logo" className="w-15 rounded-md" />
          <span className="text-lg font-bold text-black">SHARP SYSTEM COURSE</span>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = item.active
            const linkClass = isActive
              ? "bg-[#283890] shadow-lg text-white font-bold"
              : "text-black hover:bg-[#283890] hover:text-white"

            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.page)}
                className={`w-full text-left flex items-center rounded-lg p-3 pl-5 transition-colors duration-200 ${linkClass}`}
              >
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center space-x-3 rounded-lg bg-red-600 cursor-pointer p-3 font-bold transition-colors duration-200 hover:bg-red-700"
        >
          <span>SAIR</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
