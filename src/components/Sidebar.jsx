"use client"

import { useState, useEffect } from "react"
import logo from "../assets/Logo-SharpSystem.jpg"
import { usePermissions } from "../hooks/usePermissions"
import { ChevronDown, ChevronRight, Home, Users, Settings, BookOpen, FileText, BarChart3, CreditCard, MessageCircle, UserPlus, Activity } from 'lucide-react'
import "../styles/Sidebar.css"

function Sidebar({ onNavigate, currentPage, onLogout }) {
  const { 
    canAccessProfessors, 
    canAccessLogs, 
    isAluno, 
    isResponsavel, 
    isAdmin,
    isCoordenador,
    isSecretaria,
    isProfessor,
    userRole 
  } = usePermissions()

  // Estados para controlar abas expandidas - com persistência (sem animações complexas)
  const [expandedSections, setExpandedSections] = useState(() => {
    const saved = localStorage.getItem('sidebarExpandedSections')
    return saved ? JSON.parse(saved) : {
      sistema: true,
      professor: true,
      gestao: true,
      aluno: true
    }
  })

  // Estado para controlar animação de enchimento
  const [fillingItem, setFillingItem] = useState(null)

  // Persistir estado das abas no localStorage
  useEffect(() => {
    localStorage.setItem('sidebarExpandedSections', JSON.stringify(expandedSections))
  }, [expandedSections])

  // Função para acionar animação de enchimento
  const handleItemClick = (page) => {
    console.log('🎨 Iniciando animação de enchimento para:', page)
    
    // Definir o item como preenchendo e navegar imediatamente
    setFillingItem(page)
    console.log('⏳ Estado fillingItem definido como:', page)
    
    // Navegar imediatamente para não ter delay
    onNavigate(page)
    console.log('🚀 Navegação imediata executada')
    
    // Limpar o estado após a animação (0.6s)
    setTimeout(() => {
      setFillingItem(null)
      console.log('🧹 Estado fillingItem limpo')
    }, 600)
  }

  // Função simples para alternar expansão das seções (sem animações complexas)
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Verificar se o usuário tem acesso à aba Sistema (apenas ADMIN)
  const canAccessSistema = () => {
    return isAdmin()
  }

  // Verificar se o usuário tem acesso à aba Professor (PROFESSOR ou superior)
  const canAccessProfessorTab = () => {
    return isProfessor() || isSecretaria() || isCoordenador() || isAdmin()
  }

  // Verificar se o usuário tem acesso à aba Gestão (SECRETARIA ou superior)
  const canAccessGestaoTab = () => {
    return isSecretaria() || isCoordenador() || isAdmin()
  }

  // Definir itens das abas
  const sistemaItems = [
    { name: "Logs do Sistema", page: "logs", icon: Activity, condition: canAccessLogs },
    { name: "Configurações", page: "configuracoes", icon: Settings, condition: () => isAdmin() },
    { name: "Backup do Sistema", page: "backup", icon: FileText, condition: () => isAdmin() }
  ]

  const professorItems = [
    { name: "Meus Alunos", page: "meusAlunos", icon: Users, condition: () => isProfessor() || isCoordenador() || isAdmin() },
    { name: "Minhas Turmas", page: "minhasTurmas", icon: BookOpen, condition: () => isProfessor() || isCoordenador() || isAdmin() },
    { name: "Relatórios de Aula", page: "relatoriosAula", icon: BarChart3, condition: () => isProfessor() || isCoordenador() || isAdmin() }
  ]

  const gestaoItems = [
    { name: "Gestão de Professores", page: "professores", icon: Users, condition: canAccessProfessors },
    { name: "Cadastro de Alunos", page: "cadastro", icon: UserPlus, condition: () => isSecretaria() || isCoordenador() || isAdmin() },
    { name: "Relatórios", page: "relatorio", icon: BarChart3, condition: () => isSecretaria() || isCoordenador() || isAdmin() },
    { name: "Comunicados", page: "comunicados", icon: MessageCircle, condition: () => isSecretaria() || isCoordenador() || isAdmin() },
    { name: "Pagamentos", page: "pagamentos", icon: CreditCard, condition: () => isSecretaria() || isCoordenador() || isAdmin() }
  ]

  const alunoItems = [
    { name: "Atividades", page: "atividades", icon: BookOpen },
    { name: "Ranking", page: "ranking", icon: BarChart3 },
    { name: "Relatório de Desempenho", page: "relatorioAluno", icon: FileText },
    { name: "Comunicados", page: "comunicadosAluno", icon: MessageCircle },
    { name: "Pagamentos", page: "pagamentosAluno", icon: CreditCard },
    { name: "Perfil do Aluno", page: "perfil", icon: Users }
  ]

  // Renderizar seção de menu (com animação de enchimento)
  const renderSection = (title, items, sectionKey, IconComponent) => {
    const hasVisibleItems = items.some(item => !item.condition || item.condition())
    if (!hasVisibleItems) return null

    const isExpanded = expandedSections[sectionKey]

    return (
      <div className="mb-4 sidebar-section">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="sidebar-section-header flex items-center justify-between w-full p-3 text-left text-black font-semibold hover:bg-gray-300 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <IconComponent size={18} />
            <span className="section-header-title">{title}</span>
          </div>
          <div className={`chevron-icon ${isExpanded ? 'expanded' : ''}`}>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        </button>
        
        <div className={`sidebar-section-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {isExpanded && (
            <div className="ml-4 mt-2 space-y-1">
              {items.map((item) => {
                if (item.condition && !item.condition()) return null
                
                const isActive = currentPage === item.page
                const isCurrentlyFilling = fillingItem === item.page
                
                // Classes dinâmicas
                const baseClass = "sidebar-item w-full text-left flex items-center space-x-3 rounded-lg p-3 pl-5 transition-colors duration-200"
                const activeClass = isActive ? "active" : ""
                const fillingClass = isCurrentlyFilling ? "filling" : ""
                const colorClass = isActive 
                  ? "bg-[#283890] shadow-lg text-white font-bold" 
                  : "text-gray-700 hover:bg-[#283890] hover:text-white"

                const ItemIcon = item.icon

                return (
                  <button
                    key={item.name}
                    onClick={() => handleItemClick(item.page)}
                    className={`${baseClass} ${activeClass} ${fillingClass} ${colorClass}`}
                  >
                    <ItemIcon size={16} />
                    <span className="text-sm">{item.name}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-64 flex-col justify-between bg-[#D9D9D9] text-white shadow-xl">
      <div className="flex-1 overflow-y-auto sidebar-content">
        <div className="flex items-center space-x-3 p-4 border-b border-gray-300">
          <img src={logo || "/placeholder.svg"} alt="Sharp System Logo" className="w-15 rounded-md" />
          <span className="text-lg font-bold text-black">SHARP SYSTEM COURSE</span>
        </div>

        <div className="p-3">
          {/* Home - sempre visível */}
          <div className="mb-4">
            <button
              onClick={() => handleItemClick('dashboard')}
              className={`sidebar-item w-full text-left flex items-center space-x-3 rounded-lg p-3 transition-colors duration-200 ${
                currentPage === 'dashboard' ? 'active' : ''
              } ${
                fillingItem === 'dashboard' ? 'filling' : ''
              } ${
                currentPage === 'dashboard'
                  ? 'bg-[#283890] shadow-lg text-white font-bold'
                  : 'text-black hover:bg-[#283890] hover:text-white'
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
          </div>

          <nav className="space-y-2">
            {/* Aba Aluno - ALUNO e RESPONSAVEL */}
            {(isAluno() || isResponsavel()) && renderSection("Aluno", alunoItems, "aluno", BookOpen)}

            {/* Aba Professor - PROFESSOR e superiores */}
            {canAccessProfessorTab() && renderSection("Professor", professorItems, "professor", BookOpen)}

            {/* Aba Gestão - SECRETARIA e superiores */}
            {canAccessGestaoTab() && renderSection("Gestão", gestaoItems, "gestao", Users)}

            {/* Aba Sistema - apenas ADMIN (por último) */}
            {canAccessSistema() && renderSection("Sistema", sistemaItems, "sistema", Settings)}
          </nav>
        </div>
      </div>

      {/* Footer com informações do usuário e logout */}
      <div className="border-t border-gray-300">
        <div className="p-3 text-center">
          <div className="text-xs text-gray-600 mb-2">
            Logado como: <span className="font-semibold text-black">{userRole}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-red-600 cursor-pointer p-3 font-bold transition-colors duration-200 hover:bg-red-700"
          >
            <span>SAIR</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
