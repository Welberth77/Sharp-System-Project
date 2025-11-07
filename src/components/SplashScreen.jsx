"use client"

import { useEffect, useState } from "react"
import logo from "../assets/Logo-SharpSystem.jpg"
import "../styles/SplashScreen.css"

function SplashScreen({ onStartExit, onAnimationComplete }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      // Notifica que a animação de saída começou
      if (onStartExit) {
        onStartExit()
      }
    }, 2000) // Reduzido de 2500 para 2000

    return () => clearTimeout(timer)
  }, [onStartExit])

  useEffect(() => {
    if (isExiting) {
      const exitTimer = setTimeout(() => {
        onAnimationComplete()
      }, 1200) // Reduzido de 1500 para 1200
      return () => clearTimeout(exitTimer)
    }
  }, [isExiting, onAnimationComplete])

  return (
    <div className={`splash-screen ${isExiting ? "exit" : ""}`}>
      <div className="splash-content">
        <div className="splash-logo-container">
          <img src={logo || "/placeholder.svg"} alt="Sharp System Logo" className="splash-logo" />
          <h1 className="splash-title">Sharp System Course</h1>
          <h6 className="splash-title">Bem-vindo(a)!</h6>
        </div>
        <div className="splash-loader">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen
