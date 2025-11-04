"use client"

import { useEffect, useState } from "react"
import "../../styles/FreeTranslationGame.css"

function FreeTranslationGame({ gameData, onComplete }) {
  const [userInput, setUserInput] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [showNext, setShowNext] = useState(false)

  useEffect(() => {
    setUserInput("")
    setIsSubmitted(false)
    setIsCorrect(null)
    setFeedback("")
    setShowNext(false)
  }, [gameData])

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[.,!?]/g, "")
  }

  const handleSubmit = () => {
    const normalized = normalizeText(userInput)
    const expectedNormalized = normalizeText(gameData.expected)
    const correct = normalized === expectedNormalized

    setIsCorrect(correct)
    setFeedback(correct ? "Tradução correta!" : `Esperado: "${gameData.expected}"`)
    if (correct) {
      setIsSubmitted(true)
      setShowNext(true)
    } else {
      // permite nova tentativa
      setIsSubmitted(false)
    }
  }

  return (
    <div className="game-container free-translation">
      <div className="game-header">
        <h2>Tradução Livre</h2>
        <p className="instruction">Digite a tradução para o inglês</p>
      </div>

      <div className="game-content">
        <div className="portuguese-text">
          <p>{gameData.portuguese}</p>
        </div>

        <div className="input-section">
          <input
            type="text"
            className="translation-input"
            placeholder="Digite sua tradução aqui..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            disabled={isSubmitted}
          />
        </div>

        {isSubmitted && <div className={`feedback ${isCorrect ? "correct" : "incorrect"}`}>{feedback}</div>}
      </div>

      <div className="game-actions">
        <button className="btn-primary" onClick={handleSubmit} disabled={!userInput.trim() || isSubmitted}>
          Verificar Resposta
        </button>
        {showNext && (
          <button className="btn-secondary" onClick={() => onComplete(true)}>
            Próximo
          </button>
        )}
      </div>
    </div>
  )
}

export default FreeTranslationGame
