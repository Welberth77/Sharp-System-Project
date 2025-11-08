import { useState } from "react"
import DashboardAluno from "../pages/DashboardAluno"
import Atividades from "../pages/Atividades"
import RankingAlunos from "../pages/RankingAlunos"
import GestãoProfessores from "../pages/GestãoProfessores"
import { usePermissions } from "../hooks/usePermissions"

function AppRouter({ onLogout }) {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const { canAccessProfessors } = usePermissions()

  const handleLogout = () => {
    onLogout()
  }

  const handleNavigate = (page) => {
    // Verificar permissões antes de navegar
    if (page === "professores" && !canAccessProfessors()) {
      alert("Você não tem permissão para acessar esta página.")
      return
    }
    setCurrentPage(page)
  }

  // Renderizar a página atual
  switch (currentPage) {
    case "atividades":
      return <Atividades onNavigate={handleNavigate} onLogout={handleLogout} />
    case "ranking":
      return <RankingAlunos onNavigate={handleNavigate} onLogout={handleLogout} />
    case "professores":
      if (!canAccessProfessors()) {
        setCurrentPage("dashboard")
        return <DashboardAluno onNavigate={handleNavigate} onLogout={handleLogout} />
      }
      return <GestãoProfessores onNavigate={handleNavigate} onLogout={handleLogout} />
    case "dashboard":
    default:
      return <DashboardAluno onNavigate={handleNavigate} onLogout={handleLogout} />
  }
}

export default AppRouter