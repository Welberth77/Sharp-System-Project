import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { usePermissions } from "../hooks/usePermissions"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import "../styles/GestãoProfessores.css"

function GestãoProfessores({ onNavigate, onLogout }) {
  const { api, isAuthenticated, token, userRole } = useAuth()
  const { canAccessProfessors, canManageProfessors, canDeleteProfessors } = usePermissions()
  
  // Funções de formatação automática
  const formatCPF = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara XXX.XXX.XXX-XX
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }

  const formatRGNumber = (value) => {
    // Remove tudo que não é número e limita a 7 dígitos
    return value.replace(/\D/g, '').slice(0, 7)
  }

  const formatOrgaoEmissor = (value) => {
    // Remove números e caracteres especiais, mantém apenas letras e barra
    let clean = value.replace(/[^a-zA-Z\/]/g, '').toUpperCase()
    
    // Se tem mais de 3 letras sem barra, adiciona barra automaticamente
    if (clean.length >= 5 && !clean.includes('/')) {
      const orgao = clean.slice(0, -2)
      const uf = clean.slice(-2)
      return `${orgao}/${uf}`
    }
    
    return clean
  }

  const formatTelefone = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const formatCEP = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara XXXXX-XXX
    if (numbers.length <= 5) return numbers
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  // Funções de validação
  const validateCPF = (cpf) => {
    const numbers = cpf.replace(/\D/g, '')
    if (numbers.length !== 11) return false
    
    // Verifica se não é uma sequência de números iguais
    if (/^(\d)\1+$/.test(numbers)) return false
    
    // Algoritmo de validação do CPF
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i)
    }
    let digit1 = 11 - (sum % 11)
    if (digit1 > 9) digit1 = 0
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i)
    }
    let digit2 = 11 - (sum % 11)
    if (digit2 > 9) digit2 = 0
    
    return parseInt(numbers[9]) === digit1 && parseInt(numbers[10]) === digit2
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  // Verificar se o usuário tem permissão para acessar esta página
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
  
  // Aguardar o carregamento do userRole antes de verificar permissões
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Carregando permissões...</div>
        </div>
      </div>
    )
  }
  
  if (!canAccessProfessors()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">Você não tem permissão para visualizar professores.</p>
          <p className="text-sm text-gray-500">Seu role atual: {userRole}</p>
        </div>
      </div>
    )
  }
  
  const [professores, setProfessores] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingProfessorData, setLoadingProfessorData] = useState(false) // Novo estado para loading da edição
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProfessor, setEditingProfessor] = useState(null)
  const [activeTab, setActiveTab] = useState('ativos') // 'ativos' ou 'inativos'
  const [validationErrors, setValidationErrors] = useState({}) // Para erros de validação inline
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    cpf: '',
    rgNumero: '',
    orgaoEmissor: '',
    dataNascimento: '',
    telefoneContato: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    dataContratacao: '',
    professorStatus: 'ATIVO',
    formacaoAcademica: '',
    biografia: ''
  })

  // Carregar professores
  useEffect(() => {
    loadProfessores()
  }, [])

  // Filtrar professores por status
  const professoresAtivos = professores.filter(prof => prof.professorStatus === 'ATIVO')
  const professoresInativos = professores.filter(prof => prof.professorStatus === 'INATIVO')
  
  // TEMPORÁRIO: usar todos os professores para debug
  const professoresFiltrados = activeTab === 'ativos' ? professoresAtivos : professoresInativos

  // Debug dos filtros
  console.log('=== DEBUG FILTROS ===')
  console.log('Total professores:', professores.length)
  console.log('Professores ativos:', professoresAtivos.length)
  console.log('Professores inativos:', professoresInativos.length)
  console.log('Aba ativa:', activeTab)
  console.log('Professores filtrados:', professoresFiltrados.length)
  console.log('Primeiros 2 professores:', professores.slice(0, 2))
  if (professores.length > 0) {
    console.log('Status do primeiro professor:', professores[0].professorStatus)
  }
  console.log('======================')

  const loadProfessores = async () => {
    try {
      setLoading(true)
      console.log('Carregando professores...') // Debug log
      console.log('Token no localStorage:', localStorage.getItem('authToken')?.substring(0, 30) + '...') // Debug log
      console.log('Token configurado no axios:', api.defaults.headers.common.Authorization) // Debug log
      console.log('User Role:', userRole) // Debug log
      
      // Força configuração do token se não estiver configurado
      const storedToken = localStorage.getItem('authToken')
      if (storedToken && !api.defaults.headers.common.Authorization) {
        console.log('Configurando token manualmente...')
        api.defaults.headers.common.Authorization = `Bearer ${storedToken}`
      }
      
      if (!api.defaults.headers.common.Authorization) {
        console.error('Nenhum token de autorização configurado!')
        setError('Token de autenticação não encontrado. Faça login novamente.')
        setProfessores([])
        setLoading(false)
        return
      }
      
      console.log('Fazendo requisição para /professores com headers:', {
        'Authorization': api.defaults.headers.common.Authorization,
        'Content-Type': 'application/json'
      })
      
      // Fazer requisição com headers explícitos para debug
      const authToken = localStorage.getItem('authToken')
      const response = await api.get('/professores', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('Resposta da API:', response.data) // Debug log
      
      // Debug: verificar estrutura dos dados
      if (Array.isArray(response.data)) {
        console.log('Total de professores recebidos:', response.data.length)
        response.data.forEach((prof, index) => {
          console.log(`Professor ${index + 1}:`, {
            id: prof.id,
            nome: prof.nomeCompleto,
            status: prof.professorStatus,
            registro: prof.registroFuncional
          })
        })
      }
      
      setProfessores(response.data || [])
      setError('')
    } catch (error) {
      console.error('Erro ao carregar professores:', error)
      console.error('Detalhes do erro:', error.response?.data) // Debug log
      
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.')
      } else if (error.response?.status === 403) {
        setError('Você não tem permissão para visualizar professores.')
      } else {
        setError('Erro ao carregar professores. Verifique sua conexão.')
      }
      setProfessores([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Combinar RG número e órgão emissor
      const rgCompleto = formData.rgNumero && formData.orgaoEmissor 
        ? `${formData.rgNumero} ${formData.orgaoEmissor}`
        : formData.rgNumero || ''
      
      const dataToSend = {
        ...formData,
        rg: rgCompleto
      }
      
      // Remove campos temporários
      delete dataToSend.rgNumero
      delete dataToSend.orgaoEmissor
      
      console.log('Enviando dados do professor:', dataToSend) // Debug log
      console.log('Token configurado:', api.defaults.headers.common.Authorization) // Debug log

      if (editingProfessor) {
        // Editar professor existente
        console.log('Atualizando professor ID:', editingProfessor.id) // Debug log
        await api.put(`/professores/${editingProfessor.id}`, dataToSend)
        alert('Professor atualizado com sucesso!')
      } else {
        // Criar novo professor
        console.log('Criando novo professor') // Debug log
        const response = await api.post('/professores', dataToSend)
        console.log('Professor criado:', response.data) // Debug log
        alert('Professor criado com sucesso!')
      }
      
      loadProfessores()
      closeModal()
    } catch (error) {
      console.error('Erro ao salvar professor:', error)
      console.error('Detalhes do erro:', error.response?.data) // Debug log
      
      if (error.response?.status === 401) {
        alert('Sessão expirada. Faça login novamente.')
      } else if (error.response?.status === 400) {
        alert('Dados inválidos: ' + (error.response?.data?.message || 'Verifique os campos obrigatórios'))
      } else {
        alert('Erro ao salvar professor: ' + (error.response?.data?.message || error.message))
      }
    }
  }

  const handleEdit = async (professor) => {
    setEditingProfessor(professor)
    setLoadingProfessorData(true) // Iniciar loading
    setShowModal(true) // Mostrar modal com loading
    
    try {
      // Buscar dados completos do professor específico na rota debug
      console.log('Buscando dados completos do professor ID:', professor.id)
      const response = await api.get(`/professores/debug/${professor.id}`)
      console.log('Dados completos do professor:', response.data)
      
      const professorCompleto = response.data
      
      if (professorCompleto) {
        console.log('Professor completo carregado:', professorCompleto)
        
        // Separar RG em número e órgão emissor
        const rgParts = professorCompleto.rg ? professorCompleto.rg.split(' ') : ['', '']
        const rgNumero = rgParts[0] || ''
        const orgaoEmissor = rgParts.slice(1).join(' ') || ''
        
        setFormData({
          nomeCompleto: professorCompleto.nomeCompleto || '',
          email: professorCompleto.email || '',
          cpf: professorCompleto.cpf || '',
          rgNumero: rgNumero,
          orgaoEmissor: orgaoEmissor,
          dataNascimento: professorCompleto.dataNascimento || '',
          telefoneContato: professorCompleto.telefoneContato || '',
          endereco: {
            logradouro: professorCompleto.endereco?.logradouro || '',
            numero: professorCompleto.endereco?.numero || '',
            complemento: professorCompleto.endereco?.complemento || '',
            bairro: professorCompleto.endereco?.bairro || '',
            cidade: professorCompleto.endereco?.cidade || '',
            estado: professorCompleto.endereco?.estado || '',
            cep: professorCompleto.endereco?.cep || ''
          },
          dataContratacao: professorCompleto.dataContratacao || '',
          professorStatus: professorCompleto.professorStatus || 'ATIVO',
          formacaoAcademica: professorCompleto.formacaoAcademica || '',
          biografia: professorCompleto.biografia || ''
        })
      } else {
        console.warn('Dados do professor não encontrados, usando dados da lista')
        
        // Fallback para dados da lista caso a resposta esteja vazia
        const rgParts = professor.rg ? professor.rg.split(' ') : ['', '']
        const rgNumero = rgParts[0] || ''
        const orgaoEmissor = rgParts.slice(1).join(' ') || ''
        
        setFormData({
          nomeCompleto: professor.nomeCompleto || '',
          email: professor.email || '',
          cpf: professor.cpf || '',
          rgNumero: rgNumero,
          orgaoEmissor: orgaoEmissor,
          dataNascimento: professor.dataNascimento || '',
          telefoneContato: professor.telefoneContato || '',
          endereco: {
            logradouro: professor.endereco?.logradouro || '',
            numero: professor.endereco?.numero || '',
            complemento: professor.endereco?.complemento || '',
            bairro: professor.endereco?.bairro || '',
            cidade: professor.endereco?.cidade || '',
            estado: professor.endereco?.estado || '',
            cep: professor.endereco?.cep || ''
          },
          dataContratacao: professor.dataContratacao || '',
          professorStatus: professor.professorStatus || 'ATIVO',
          formacaoAcademica: professor.formacaoAcademica || '',
          biografia: professor.biografia || ''
        })
      }
    } catch (error) {
      console.error('Erro ao buscar dados completos do professor:', error)
      
      // Fallback para dados básicos em caso de erro
      const rgParts = professor.rg ? professor.rg.split(' ') : ['', '']
      const rgNumero = rgParts[0] || ''
      const orgaoEmissor = rgParts.slice(1).join(' ') || ''
      
      setFormData({
        nomeCompleto: professor.nomeCompleto || '',
        email: professor.email || '',
        cpf: professor.cpf || '',
        rgNumero: rgNumero,
        orgaoEmissor: orgaoEmissor,
        dataNascimento: professor.dataNascimento || '',
        telefoneContato: professor.telefoneContato || '',
        endereco: {
          logradouro: professor.endereco?.logradouro || '',
          numero: professor.endereco?.numero || '',
          complemento: professor.endereco?.complemento || '',
          bairro: professor.endereco?.bairro || '',
          cidade: professor.endereco?.cidade || '',
          estado: professor.endereco?.estado || '',
          cep: professor.endereco?.cep || ''
        },
        dataContratacao: professor.dataContratacao || '',
        professorStatus: professor.professorStatus || 'ATIVO',
        formacaoAcademica: professor.formacaoAcademica || '',
        biografia: professor.biografia || ''
      })
      
      alert('Aviso: Não foi possível carregar todos os dados do professor. Alguns campos podem estar vazios.')
    } finally {
      setLoadingProfessorData(false) // Parar loading
    }
  }

  const handleDelete = async (id) => {
    if (!canDeleteProfessors()) {
      alert('Você não tem permissão para excluir professores.')
      return
    }
    
    if (window.confirm('⚠️ ATENÇÃO: Esta ação irá EXCLUIR PERMANENTEMENTE este professor do sistema. Esta ação não pode ser desfeita. Tem certeza que deseja continuar?')) {
      try {
        console.log('Excluindo professor ID:', id) // Debug log
        console.log('Token configurado:', api.defaults.headers.common.Authorization) // Debug log
        
        await api.delete(`/professores/${id}`)
        alert('Professor excluído permanentemente com sucesso!')
        loadProfessores()
      } catch (error) {
        console.error('Erro ao excluir professor:', error)
        console.error('Detalhes do erro:', error.response?.data) // Debug log
        
        if (error.response?.status === 401) {
          alert('Sessão expirada. Faça login novamente.')
        } else {
          alert('Erro ao excluir professor: ' + (error.response?.data?.message || error.message))
        }
      }
    }
  }

  const handleInactivate = async (professor) => {
    if (window.confirm(`Tem certeza que deseja inativar o professor ${professor.nomeCompleto}? Ele será movido para a aba "Professores Inativos".`)) {
      try {
        console.log('Inativando professor ID:', professor.id)
        
        const updatedData = {
          ...professor,
          professorStatus: 'INATIVO'
        }
        
        await api.put(`/professores/${professor.id}`, updatedData)
        alert('Professor inativado com sucesso!')
        loadProfessores()
      } catch (error) {
        console.error('Erro ao inativar professor:', error)
        console.error('Detalhes do erro:', error.response?.data)
        
        if (error.response?.status === 401) {
          alert('Sessão expirada. Faça login novamente.')
        } else {
          alert('Erro ao inativar professor: ' + (error.response?.data?.message || error.message))
        }
      }
    }
  }

  const handleReactivate = async (professor) => {
    if (window.confirm(`Tem certeza que deseja reativar o professor ${professor.nomeCompleto}?`)) {
      try {
        console.log('Reativando professor ID:', professor.id)
        
        const updatedData = {
          ...professor,
          professorStatus: 'ATIVO'
        }
        
        await api.put(`/professores/${professor.id}`, updatedData)
        alert('Professor reativado com sucesso!')
        loadProfessores()
      } catch (error) {
        console.error('Erro ao reativar professor:', error)
        console.error('Detalhes do erro:', error.response?.data)
        
        if (error.response?.status === 401) {
          alert('Sessão expirada. Faça login novamente.')
        } else {
          alert('Erro ao reativar professor: ' + (error.response?.data?.message || error.message))
        }
      }
    }
  }

  const openCreateModal = () => {
    setEditingProfessor(null)
    setValidationErrors({}) // Limpar erros de validação
    setFormData({
      nomeCompleto: '',
      email: '',
      cpf: '',
      rgNumero: '',
      orgaoEmissor: '',
      dataNascimento: '',
      telefoneContato: '',
      endereco: {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      },
      dataContratacao: '',
      professorStatus: 'ATIVO',
      formacaoAcademica: '',
      biografia: ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProfessor(null)
    setLoadingProfessorData(false) // Resetar loading
    setValidationErrors({}) // Limpar erros de validação
    setFormData({
      nomeCompleto: '',
      email: '',
      cpf: '',
      rgNumero: '',
      orgaoEmissor: '',
      dataNascimento: '',
      telefoneContato: '',
      endereco: {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      },
      dataContratacao: '',
      professorStatus: 'ATIVO',
      formacaoAcademica: '',
      biografia: ''
    })
  }

  // Função helper para atualizar campos do endereço
  const updateEnderecoField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value
      }
    }))
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onNavigate={onNavigate} currentPage="professores" onLogout={onLogout} />

      <div className="flex-1 flex flex-col">
        <Header studentName="Gestão de Professores" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Professores</h1>
              {canManageProfessors() && (
                <button
                  onClick={openCreateModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  + Novo Professor
                </button>
              )}
            </div>
            
            {/* Abas para Ativos/Inativos */}
            <div className="mt-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('ativos')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'ativos'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Professores Ativos ({professoresAtivos.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('inativos')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'inativos'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Professores Inativos ({professoresInativos.length})
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Carregando professores...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-800 font-medium mb-2">Erro ao carregar dados</div>
              <div className="text-red-600 mb-4">{error}</div>
              <button 
                onClick={() => {
                  setError('')
                  loadProfessores()
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome Completo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registro Funcional
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      {canManageProfessors() && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {professoresFiltrados.length > 0 ? (
                      professoresFiltrados.map((professor) => (
                        <tr key={professor.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {professor.nomeCompleto}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {professor.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {professor.telefoneContato}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {professor.registroFuncional}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              professor.professorStatus === 'ATIVO' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {professor.professorStatus || 'SEM STATUS'}
                            </span>
                          </td>
                          {canManageProfessors() && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                {activeTab === 'ativos' ? (
                                  // Ações para professores ativos
                                  <>
                                    <button
                                      onClick={() => handleEdit(professor)}
                                      disabled={loadingProfessorData}
                                      className={`font-medium ${
                                        loadingProfessorData 
                                          ? 'text-gray-400 cursor-not-allowed' 
                                          : 'text-blue-600 hover:text-blue-900'
                                      }`}
                                    >
                                      {loadingProfessorData ? 'Carregando...' : 'Editar'}
                                    </button>
                                    <button
                                      onClick={() => handleInactivate(professor)}
                                      className="text-orange-600 hover:text-orange-900 font-medium"
                                    >
                                      Inativar
                                    </button>
                                  </>
                                ) : (
                                  // Ações para professores inativos
                                  <>
                                    <span className="text-gray-400 font-medium cursor-not-allowed">
                                      Editar
                                    </span>
                                    <button
                                      onClick={() => handleReactivate(professor)}
                                      className="text-green-600 hover:text-green-900 font-medium"
                                    >
                                      Reativar
                                    </button>
                                    {canDeleteProfessors() && (
                                      <button
                                        onClick={() => handleDelete(professor.id)}
                                        className="text-red-600 hover:text-red-900 font-medium"
                                      >
                                        Excluir Permanentemente
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          {activeTab === 'ativos' 
                            ? 'Nenhum professor ativo encontrado' 
                            : 'Nenhum professor inativo encontrado'
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal para criar/editar professor */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[95vh] flex flex-col">
            {/* Header fixo */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingProfessor ? 'Editar Professor' : 'Novo Professor'}
                </h2>
                {loadingProfessorData && (
                  <div className="flex items-center text-blue-600">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm">Carregando dados completos...</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Conteúdo com scroll */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingProfessorData ? (
                // Tela de loading
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <svg className="animate-spin mx-auto h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg text-gray-600 mb-2">Carregando dados completos do professor</p>
                    <p className="text-sm text-gray-500">Buscando informações detalhadas na API...</p>
                  </div>
                </div>
              ) : (
                // Formulário normal
                <form onSubmit={handleSubmit} className="space-y-6" id="professorForm">
              {/* Dados Pessoais */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.nomeCompleto}
                      onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                      <span>Email *</span>
                      {validationErrors.email && (
                        <span className="text-red-500 text-xs font-normal">
                          {validationErrors.email}
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        // Limpar erro quando o usuário começar a digitar
                        if (validationErrors.email) {
                          setValidationErrors(prev => ({ ...prev, email: null }))
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value && !validateEmail(e.target.value)) {
                          setValidationErrors(prev => ({ ...prev, email: 'Email inválido' }))
                        } else {
                          setValidationErrors(prev => ({ ...prev, email: null }))
                        }
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                        validationErrors.email
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                      <span>CPF *</span>
                      {validationErrors.cpf && (
                        <span className="text-red-500 text-xs font-normal">
                          {validationErrors.cpf}
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => {
                        const formatted = formatCPF(e.target.value)
                        setFormData({ ...formData, cpf: formatted })
                        // Limpar erro quando o usuário começar a digitar
                        if (validationErrors.cpf) {
                          setValidationErrors(prev => ({ ...prev, cpf: null }))
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value && !validateCPF(e.target.value)) {
                          setValidationErrors(prev => ({ ...prev, cpf: 'CPF inválido' }))
                        } else {
                          setValidationErrors(prev => ({ ...prev, cpf: null }))
                        }
                      }}
                      placeholder="000.000.000-00"
                      maxLength="14"
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                        validationErrors.cpf
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        RG (Números) *
                      </label>
                      <input
                        type="text"
                        value={formData.rgNumero}
                        onChange={(e) => {
                          const formatted = formatRGNumber(e.target.value)
                          setFormData({ ...formData, rgNumero: formatted })
                        }}
                        placeholder="1234567"
                        maxLength="7"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Órgão Emissor *
                      </label>
                      <input
                        type="text"
                        value={formData.orgaoEmissor}
                        onChange={(e) => {
                          const formatted = formatOrgaoEmissor(e.target.value)
                          setFormData({ ...formData, orgaoEmissor: formatted })
                        }}
                        placeholder="SSP/AL"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone de Contato *
                    </label>
                    <input
                      type="tel"
                      value={formData.telefoneContato}
                      onChange={(e) => {
                        const formatted = formatTelefone(e.target.value)
                        setFormData({ ...formData, telefoneContato: formatted })
                      }}
                      placeholder="(00) 00000-0000"
                      maxLength="15"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logradouro *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.logradouro}
                      onChange={(e) => updateEnderecoField('logradouro', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.numero}
                      onChange={(e) => updateEnderecoField('numero', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.complemento}
                      onChange={(e) => updateEnderecoField('complemento', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.bairro}
                      onChange={(e) => updateEnderecoField('bairro', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.cidade}
                      onChange={(e) => updateEnderecoField('cidade', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      value={formData.endereco.estado}
                      onChange={(e) => updateEnderecoField('estado', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione o Estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.cep}
                      onChange={(e) => {
                        const formatted = formatCEP(e.target.value)
                        updateEnderecoField('cep', formatted)
                      }}
                      placeholder="00000-000"
                      maxLength="9"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dados Profissionais */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Dados Profissionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Contratação *
                    </label>
                    <input
                      type="date"
                      value={formData.dataContratacao}
                      onChange={(e) => setFormData({ ...formData, dataContratacao: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={formData.professorStatus}
                      onChange={(e) => setFormData({ ...formData, professorStatus: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="ATIVO">Ativo</option>
                      <option value="INATIVO">Inativo</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formação Acadêmica *
                    </label>
                    <input
                      type="text"
                      value={formData.formacaoAcademica}
                      onChange={(e) => setFormData({ ...formData, formacaoAcademica: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Letras - Inglês pela UFAL"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biografia *
                  </label>
                  <textarea
                    value={formData.biografia}
                    onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descreva a experiência e qualificações do professor..."
                    required
                  />
                </div>
                </div>
              </form>
              )}
            </div>            {/* Footer fixo */}
            <div className="p-6 border-t border-gray-200 flex-shrink-0">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loadingProfessorData}
                  className={`px-6 py-2 border border-gray-300 rounded-lg transition-colors ${
                    loadingProfessorData
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="professorForm"
                  disabled={loadingProfessorData}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    loadingProfessorData
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loadingProfessorData 
                    ? 'Carregando...' 
                    : `${editingProfessor ? 'Atualizar' : 'Criar'} Professor`
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestãoProfessores