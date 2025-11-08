"use client"

import { useState } from "react"
import "./App.css"
import Login from "./pages/Login"
import AppRouter from "./components/AppRouter"
import SplashScreen from "./components/SplashScreen"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [splashExiting, setSplashExiting] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
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
