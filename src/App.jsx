"use client"

import { useState } from "react"
import "./App.css"
import Login from "./pages/Login"
import DashboardAluno from "./pages/DashboardAluno"
import Atividades from "./pages/Atividades"
import RankingAlunos from "./pages/RankingAlunos"
import SplashScreen from "./components/SplashScreen"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [splashExiting, setSplashExiting] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage("dashboard")
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
    if (currentPage === "atividades") {
      return <Atividades onNavigate={setCurrentPage} onLogout={handleLogout} />
    }
    else if (currentPage == "ranking")
    {
      return <RankingAlunos onNavigate={setCurrentPage} onLogout={handleLogout}/>
    }
    return <DashboardAluno onNavigate={setCurrentPage} onLogout={handleLogout} />
  } else {
    return (
      <div className="login-static">
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    )
  }
}

export default App
