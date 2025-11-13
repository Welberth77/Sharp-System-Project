/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import axios from "axios"

// Configuração do cliente HTTP (ajuste a baseURL conforme necessário)
const api = axios.create({
  baseURL:
    import.meta.env?.VITE_API_BASE || (import.meta.env.DEV ? "/api" : "https://api.giorgiorafael.com/"),
})

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null)
  const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole") || null)
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("userData")
    return stored ? JSON.parse(stored) : null
  })

  // Configurar token inicial se existir
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    const storedRole = localStorage.getItem("userRole")
    const storedUserData = localStorage.getItem("userData")
    
    if (storedToken && !token) {
      console.log('Carregando dados do localStorage...') // Debug
      console.log('Token encontrado:', storedToken?.substring(0, 30) + '...') // Debug
      console.log('Role encontrado:', storedRole) // Debug
      
      // Verificar se não é um token de teste antigo
      if (!storedToken.includes('test_admin_token')) {
        api.defaults.headers.common.Authorization = `Bearer ${storedToken}`
        setToken(storedToken)
        
        if (storedRole) {
          setUserRole(storedRole)
        }
        
        if (storedUserData) {
          try {
            setUserData(JSON.parse(storedUserData))
          } catch (e) {
            console.error('Erro ao parsear userData:', e)
          }
        }
        
        console.log('Headers configurados:', api.defaults.headers.common.Authorization) // Debug
      } else {
        // Limpar tokens de teste antigos
        console.log('Removendo token de teste antigo')
        localStorage.removeItem("authToken")
        localStorage.removeItem("userRole")
        localStorage.removeItem("userData")
      }
    }
  }, []) // Executar apenas na inicialização

  useEffect(() => {
    console.log('Token state mudou:', token?.substring(0, 30) + '...') // Debug
    if (token) {
      localStorage.setItem("authToken", token)
      api.defaults.headers.common.Authorization = `Bearer ${token}`
      console.log('Headers configurados no axios:', api.defaults.headers.common.Authorization?.substring(0, 40) + '...') // Debug
    } else {
      // Token foi removido ou é null - limpar tudo
      localStorage.removeItem("authToken")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userData")
      delete api.defaults.headers.common.Authorization
      console.log('Token removido, headers e localStorage limpos') // Debug
    }
  }, [token])

  useEffect(() => {
    if (userRole) {
      localStorage.setItem("userRole", userRole)
    } else {
      localStorage.removeItem("userRole")
    }
  }, [userRole])

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData))
    } else {
      localStorage.removeItem("userData")
    }
  }, [userData])

  const login = async (loginId, password) => {
    try {
      console.log('Tentando login com:', loginId) // Debug log
      
      const response = await api.post("/auth/login", {
        login: loginId,
        password,
      })

      console.log('Resposta do login:', response.data) // Debug log

      const bearerToken = response.data?.bearerToken || response.data?.token || response.data?.accessToken
      const role = response.data?.role || response.data?.user?.role
      const user = response.data?.user || response.data
      
      if (!bearerToken) {
        console.error("Token ausente na resposta do login:", response.data)
        throw new Error("Token ausente na resposta do login")
      }

      console.log('Token recebido:', bearerToken?.substring(0, 20) + '...') // Debug log
      console.log('Role recebido:', role) // Debug log

      setToken(bearerToken)
      setUserRole(role)
      setUserData(user)
      return true
    } catch (error) {
      console.error("Falha no login:", error)
      console.error("Detalhes da resposta:", error.response?.data) // Debug log
      setToken(null)
      setUserRole(null)
      setUserData(null)
      return false
    }
  }

  const logout = () => {
    console.log('Executando logout no AuthContext...') // Debug
    
    // Limpar estados
    setToken(null)
    setUserRole(null)
    setUserData(null)
    
    // Limpar localStorage explicitamente
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")  
    localStorage.removeItem("userData")
    
    // Limpar headers do axios
    delete api.defaults.headers.common.Authorization
    
    console.log('Logout do AuthContext concluído') // Debug
    console.log('Token após logout:', localStorage.getItem("authToken")) // Debug
    console.log('Headers após logout:', api.defaults.headers.common.Authorization) // Debug
  }

  const value = useMemo(
    () => ({ 
      token, 
      userRole, 
      userData, 
      isAuthenticated: Boolean(token), 
      login, 
      logout, 
      api 
    }),
    [token, userRole, userData],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>")
  return ctx
}

export { api }
