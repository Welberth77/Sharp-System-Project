"use client"

import { useState } from "react"
import "./App.css"
import Login from "./pages/Login"
import DashboardAluno from "./pages/DashboardAluno"
import SplashScreen from "./components/SplashScreen"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (showSplash) {
    return <SplashScreen onAnimationComplete={() => setShowSplash(false)} />
  }

  if (isLoggedIn) {
    return <DashboardAluno onLogout={handleLogout} />
  } else {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }
}

export default App
