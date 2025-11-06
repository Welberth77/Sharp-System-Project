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

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token)
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      localStorage.removeItem("authToken")
      delete api.defaults.headers.common.Authorization
    }
  }, [token])

  const login = async (loginId, password) => {
    try {
      const response = await api.post("/auth/login", {
        login: loginId,
        password,
      })

      // Ajuste o nome da propriedade conforme retorno da sua API
      const bearerToken = response.data?.bearerToken || response.data?.token
      if (!bearerToken) throw new Error("Token ausente na resposta do login")

      setToken(bearerToken)
      return true
    } catch (error) {
      console.error("Falha no login:", error)
      setToken(null)
      return false
    }
  }

  const logout = () => {
    setToken(null)
  }

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), login, logout, api }),
    [token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>")
  return ctx
}

export { api }
