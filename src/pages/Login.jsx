"use client"

// Componetes
import { useState } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import logo from "../assets/Logo-SharpSystem.jpg"
import AnimatedInput from "../components/AnimatedInput"
import "../styles/Login.css"

const TEST_EMAIL = "admin"
const TEST_PASSWORD = "admin"
const API_URL = 'https://api.giorgiorafael.com/';
function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("admin")
  const [password, setPassword] = useState("admin")
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const { login } = useAuth();
  const primaryColor = "#283890"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setEmailError("")
    
    // Aceitar login por usuário OU e-mail (apenas checa se está preenchido)
    if (!email || email.trim() === "") {
      setEmailError("Informe seu login")
      return
    }
    // Credenciais de teste para ambiente local
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      onLoginSuccess()
      return
    }

    // Tenta login na API
    const success = await login(email, password)
    if (success) {
      onLoginSuccess()
    } else {
      setError("E-mail ou senha incorretos.")
    }
  }

  return (
    <div className="flex min-h-screen login-container">
      <div className="hidden w-1/2 flex-col items-center justify-center space-y-8 bg-[#283890] p-12 text-white lg:flex login-left-panel">
        <div className="flex flex-col items-center text-center">
          <img src={logo || "/placeholder.svg"} alt="Sharp System Logo" className="w-80" />
          <span className="text-4xl font-bold">Sharp System Course</span>
        </div>
      </div>

      <div className="w-full bg-[#F5F5F5] p-8 lg:w-1/2 lg:p-16 flex items-center justify-center login-right-panel">
        <div className="w-full max-w-sm login-form-container">
          <h2 className="text-4xl font-extrabold text-[#283890] mb-2">Bem-vindo(a)!</h2>
          <p className="mb-10 text-4xl font-extrabold text-[#283890]">Faça seu login.</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm font-medium text-red-700 border border-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} method="POST">
            <AnimatedInput
              type="text"
              name="login"
              placeholder="Login"
              value={email}
              onChange={(e) => {
                const v = e.target.value
                setEmail(v)
                if (emailError) setEmailError("")
              }}
              onBlur={(e) => {
                const v = e.target.value
                if (!v || v.trim() === "") {
                  setEmailError("Informe seu login")
                } else {
                  setEmailError("")
                }
              }}
              error={!!emailError}
            />

            {emailError && <p className="mt-2 text-sm text-red-600 mb-4">{emailError}</p>}

            <AnimatedInput
              type="password"
              name="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="mb-8 flex justify-between">
              <a href="#" className="text-base font-semibold text-blue-600 cursor-pointer hover:underline">
                Esqueceu sua senha?
              </a>
              <a href="" className="text-base font-semibold text-blue-600 cursor-pointer hover:underline">
                Cadastre-se aqui!
              </a>
            </div>

            <div>
              <button
                type="submit"
                className={`flex w-full justify-center rounded-lg bg-[${primaryColor}] cursor-pointer px-4 py-3 text-lg font-bold uppercase tracking-wider text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
