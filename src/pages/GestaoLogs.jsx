import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { usePermissions } from "../hooks/usePermissions"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import "../styles/GestaoLogs.css"

// Ícones simples em SVG
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const DocumentIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

function GestaoLogs({ onNavigate, onLogout }) {
  const { api, isAuthenticated, userRole } = useAuth()
  const { canAccessLogs } = usePermissions()
  
  // Estados principais
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    username: '',
    acao: '',
    timeFilter: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedLogs, setExpandedLogs] = useState(new Set())
  const [availableActions, setAvailableActions] = useState(new Set())

  // Verificações de acesso
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado para acessar esta página.</p>
          <button 
            onClick={() => onNavigate('login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fazer Login
          </button>
        </div>
      </div>
    )
  }
  
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Carregando permissões...</div>
        </div>
      </div>
    )
  }
  
  if (!canAccessLogs()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">Apenas administradores podem acessar os logs do sistema.</p>
          <p className="text-sm text-gray-500">Seu role atual: {userRole}</p>
        </div>
      </div>
    )
  }

  // Carregar logs
  useEffect(() => {
    loadLogs()
  }, [currentPage, pageSize, filters])

  // Inicializar ações básicas apenas na primeira vez
  useEffect(() => {
    if (availableActions.size === 0) {
      const basicActions = new Set(['POST', 'PUT', 'DELETE', 'GET', 'PATCH'])
      setAvailableActions(basicActions)
    }
  }, [])

  const loadLogs = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Construir query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        sort: 'createdAt,desc'
      })
      
      // Adicionar filtros se preenchidos
      if (filters.username.trim()) {
        params.append('username', filters.username.trim())
      }
      if (filters.acao.trim()) {
        params.append('acao', filters.acao.trim())
      }
      if (filters.timeFilter && filters.timeFilter !== 'all') {
        params.append('timeFilter', filters.timeFilter)
      }
      
      console.log('Carregando logs com params:', params.toString())
      
      const response = await api.get(`/logs?${params.toString()}`)
      
      console.log('Resposta dos logs:', response.data)
      
      if (response.status === 200) {
        setLogs(response.data.content || [])
        setTotalPages(response.data.totalPages || 0)
        setTotalElements(response.data.totalElements || 0)
        
        // Extrair ações únicas dos logs para popular o dropdown
        const actions = new Set(availableActions) // Começar com ações básicas
        const content = response.data.content || []
        content.forEach(log => {
          if (log.action) {
            // Extrair método HTTP se existir
            const methodMatch = log.action.match(/(GET|POST|PUT|DELETE|PATCH)/i)
            if (methodMatch) {
              actions.add(methodMatch[1].toUpperCase())
            }
            
            // Extrair nome da operação (antes do @)
            if (log.action.includes('@')) {
              const operationName = log.action.split('@')[0].trim()
              if (operationName) {
                actions.add(operationName)
              }
            }
          }
        })
        setAvailableActions(actions)
      }
    } catch (err) {
      console.error('Erro ao carregar logs:', err)
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.')
      } else if (err.response?.status === 403) {
        setError('Você não tem permissão para acessar os logs.')
      } else {
        setError('Erro ao carregar logs. Verifique sua conexão.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
    setCurrentPage(0)
  }

  const clearFilters = () => {
    setFilters({
      username: '',
      acao: '',
      timeFilter: 'all'
    })
    setSearchTerm('')
    setCurrentPage(0)
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getActionColor = (action) => {
    if (action.includes('POST') || action.includes('create')) return 'bg-green-100 text-green-800'
    if (action.includes('PUT') || action.includes('update')) return 'bg-yellow-100 text-yellow-800'
    if (action.includes('DELETE') || action.includes('delete')) return 'bg-red-100 text-red-800'
    return 'bg-blue-100 text-blue-800'
  }

  const getActionIcon = (action) => {
    if (action.includes('POST') || action.includes('create')) return '➕'
    if (action.includes('PUT') || action.includes('update')) return '✏️'
    if (action.includes('DELETE') || action.includes('delete')) return '🗑️'
    return '📋'
  }

  const toggleLogExpansion = (logId) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(logId)) {
        newSet.delete(logId)
      } else {
        newSet.add(logId)
      }
      return newSet
    })
  }

  const parseLogDetails = (details) => {
    // Verificar se é um diff de update (contém "->")
    if (details.includes(' -> ')) {
      const changes = details.split('; ').map(change => {
        const [field, values] = change.split(': ')
        if (values && values.includes(' -> ')) {
          const [oldValue, newValue] = values.split(' -> ')
          return { field, oldValue, newValue, type: 'change' }
        }
        return { field: change, type: 'simple' }
      })
      return changes
    }
    
    // Se não é um diff, tentar fazer parse como JSON
    try {
      const parsed = JSON.parse(details)
      return Object.entries(parsed).map(([field, value]) => ({
        field,
        value: typeof value === 'object' ? JSON.stringify(value) : value,
        type: 'json'
      }))
    } catch {
      // Se não conseguir fazer parse, retornar como texto simples
      return [{ field: 'Detalhes', value: details, type: 'simple' }]
    }
  }

  const formatFieldName = (fieldName) => {
    const fieldTranslations = {
      'nomeCompleto': 'Nome Completo',
      'cpf': 'CPF',
      'rg': 'RG',
      'dataNascimento': 'Data de Nascimento',
      'telefoneContato': 'Telefone',
      'email': 'E-mail',
      'endereco': 'Endereço',
      'dataContratacao': 'Data de Contratação',
      'professorStatus': 'Status do Professor',
      'formacaoAcademica': 'Formação Acadêmica',
      'biografia': 'Biografia'
    }
    return fieldTranslations[fieldName] || fieldName
  }

  // Filtrar logs localmente se houver termo de busca
  const filteredLogs = searchTerm
    ? logs.filter(log => 
        log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : logs

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null
    
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{currentPage * pageSize + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min((currentPage + 1) * pageSize, totalElements)}
              </span>{' '}
              de <span className="font-medium">{totalElements}</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              {pages.map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Próximo
              </button>
            </nav>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onNavigate={onNavigate} currentPage="logs" onLogout={onLogout} />

      <div className="flex-1 flex flex-col">
        <Header studentName="Gestão de Logs" />

        <main className="flex-1 overflow-y-auto p-8">
          {/* Header da Página */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Logs do Sistema</h1>
                <p className="text-gray-600 mt-2">
                  Histórico de atividades e auditoria do sistema
                </p>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Busca Global */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar em logs (usuário, ação, detalhes)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FilterIcon />
                  Filtros
                </button>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <XIcon />
                  Limpar
                </button>
              </div>
            </div>

            {/* Painel de Filtros Avançados */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Filtro por Usuário */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserIcon /> Usuário
                    </label>
                    <input
                      type="text"
                      placeholder="Nome do usuário"
                      value={filters.username}
                      onChange={(e) => handleFilterChange('username', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filtro por Ação */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DocumentIcon /> Ação
                    </label>
                    <select
                      value={filters.acao}
                      onChange={(e) => handleFilterChange('acao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Todas as ações</option>
                      <optgroup label="Métodos HTTP">
                        <option value="POST">POST (Criar)</option>
                        <option value="PUT">PUT (Atualizar)</option>
                        <option value="DELETE">DELETE (Excluir)</option>
                        <option value="GET">GET (Consultar)</option>
                        <option value="PATCH">PATCH (Modificar)</option>
                      </optgroup>
                      <optgroup label="Operações">
                        <option value="create">Criação</option>
                        <option value="update">Atualização</option>
                        <option value="delete">Exclusão</option>
                        <option value="get">Consulta</option>
                        <option value="fetch">Busca</option>
                      </optgroup>
                      {Array.from(availableActions).length > 0 && (
                        <optgroup label="Ações Encontradas">
                          {Array.from(availableActions).sort().map(action => (
                            <option key={action} value={action}>
                              {action.toUpperCase()}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  {/* Filtro por Período */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ClockIcon /> Período
                    </label>
                    <select
                      value={filters.timeFilter}
                      onChange={(e) => handleFilterChange('timeFilter', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Todos os períodos</option>
                      <option value="24h">Últimas 24 horas</option>
                      <option value="7d">Últimos 7 dias</option>
                      <option value="30d">Últimos 30 dias</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Informações dos Resultados */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-medium">{filteredLogs.length}</span> de{' '}
                <span className="font-medium">{totalElements}</span> logs
                {searchTerm && ` (filtrados por "${searchTerm}")`}
              </div>
              
              {/* Tamanho da Página */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Logs por página:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(0)
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Logs */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-gray-600">Carregando logs...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-800 font-medium mb-2">Erro ao carregar logs</div>
              <div className="text-red-600 mb-4">{error}</div>
              <button 
                onClick={() => {
                  setError('')
                  loadLogs()
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Tentar Novamente
              </button>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <DocumentIcon />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum log encontrado</h3>
              <p className="text-gray-500">
                {searchTerm || filters.username || filters.acao || filters.timeFilter !== 'all'
                  ? 'Tente ajustar os filtros ou termos de busca.'
                  : 'Não há logs registrados no sistema ainda.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <ClockIcon /> Data/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <UserIcon /> Usuário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <DocumentIcon /> Ação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detalhes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map((log) => {
                      const isExpanded = expandedLogs.has(log.id)
                      const parsedDetails = parseLogDetails(log.details)
                      const hasExpandableDetails = parsedDetails.length > 1 || parsedDetails[0].type === 'change'
                      
                      return (
                        <React.Fragment key={log.id}>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                              #{log.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(log.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <UserIcon />
                                </div>
                                <div className="ml-3">
                                  <span className="text-sm font-medium text-gray-900">
                                    {log.username}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-lg mr-2">{getActionIcon(log.action)}</span>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                                  {log.action}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  {hasExpandableDetails ? (
                                    <div className="text-sm text-gray-600">
                                      {parsedDetails.length} alteração(ões) detectada(s)
                                    </div>
                                  ) : (
                                    <div className="max-w-xs truncate" title={log.details}>
                                      {log.details}
                                    </div>
                                  )}
                                </div>
                                {hasExpandableDetails && (
                                  <button
                                    onClick={() => toggleLogExpansion(log.id)}
                                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    title={isExpanded ? "Ocultar detalhes" : "Expandir detalhes"}
                                  >
                                    {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                          
                          {/* Linha expandida com detalhes */}
                          {isExpanded && hasExpandableDetails && (
                            <tr>
                              <td colSpan="5" className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-gray-800 mb-3">
                                    📋 Detalhes da Operação
                                  </h4>
                                  <div className="grid gap-3">
                                    {parsedDetails.map((detail, index) => {
                                      if (detail.type === 'change') {
                                        return (
                                          <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {formatFieldName(detail.field)}
                                              </span>
                                              <span className="text-xs text-blue-600 font-medium">ALTERADO</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                              <div className="bg-red-50 p-2 rounded border border-red-200">
                                                <div className="text-xs text-red-600 font-medium mb-1">Valor Anterior</div>
                                                <div className="text-sm text-red-800 font-mono break-all">
                                                  {detail.oldValue || 'Vazio'}
                                                </div>
                                              </div>
                                              <div className="bg-green-50 p-2 rounded border border-green-200">
                                                <div className="text-xs text-green-600 font-medium mb-1">Valor Atual</div>
                                                <div className="text-sm text-green-800 font-mono break-all">
                                                  {detail.newValue || 'Vazio'}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      } else if (detail.type === 'json') {
                                        return (
                                          <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {formatFieldName(detail.field)}
                                              </span>
                                              <span className="text-xs text-blue-600 font-medium">DADOS</span>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded border">
                                              <div className="text-sm text-gray-800 font-mono break-all">
                                                {detail.value}
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="text-sm text-gray-800">
                                              {detail.field}
                                            </div>
                                          </div>
                                        )
                                      }
                                    })}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Paginação */}
              {renderPagination()}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default GestaoLogs