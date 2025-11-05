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
  const [currentPage, setCurrentPage] = useState("dashboard")

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage("dashboard")
  }

  if (showSplash) {
    return <SplashScreen onAnimationComplete={() => setShowSplash(false)} />
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
    return <Login onLoginSuccess={handleLoginSuccess} />
  }
}

export default App
