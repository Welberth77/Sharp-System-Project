"use client"

import { useState, useEffect } from "react"
import "./App.css"
import Login from "./pages/Login"
import AppRouter from "./components/AppRouter"
import SplashScreen from "./components/SplashScreen"
import { useAuth } from "./context/AuthContext"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [splashExiting, setSplashExiting] = useState(false)
  const { logout, isAuthenticated } = useAuth() // Importar isAuthenticated também

  // Sincronizar estado local com AuthContext na inicialização
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Token válido encontrado, fazendo login automático') // Debug
      setIsLoggedIn(true)
    }
  }, [isAuthenticated])

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    console.log('Executando logout completo...') // Debug
    logout() // Limpar token e dados do AuthContext
    setIsLoggedIn(false) // Atualizar estado local do App
    console.log('Logout completo realizado') // Debug
  }

  const handleSplashExit = () => {
    setSplashExiting(true)
  }

  const handleSplashComplete = () => {
    setShowSplash(false)
    setSplashExiting(false)
  }

  // Renderização com transição fluida
  if (showSplash) {
    return (
      <div className="app-container">
        {/* A tela de login fica por baixo da splash screen */}
        {splashExiting && !isLoggedIn && (
          <div className="login-transition">
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        )}
        <SplashScreen 
          onStartExit={handleSplashExit}
          onAnimationComplete={handleSplashComplete} 
        />
      </div>
    )
  }

  if (isLoggedIn) {
    return <AppRouter onLogout={handleLogout} />
  } else {
    return (
      <div className="login-static">
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    )
  }
}

export default App
