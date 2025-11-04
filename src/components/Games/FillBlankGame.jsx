"use client"

import { useEffect, useState } from "react"
import "../../styles/FillBlankGame.css"

function FillBlankGame({ gameData, onComplete }) {
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [showNext, setShowNext] = useState(false)

  // Reset state when challenge changes
  useEffect(() => {
    setSelectedIdx(null)
    setIsAnswered(false)
    setIsCorrect(null)
    setShowNext(false)
  }, [gameData])

  const normalize = (s) => String(s ?? "").toLowerCase()

  const handleAnswer = (option, idx) => {
    // Permite novas tentativas quando a resposta anterior foi incorreta
    if (isCorrect === true) return

    setSelectedIdx(idx)
    const correct = normalize(option) === normalize(gameData.correct)
    setIsCorrect(correct)
    setIsAnswered(true)
    if (correct) setShowNext(true)
  }

  return (
    <div className="game-container fill-blank">
      <div className="game-header">
        <h2>Preencha a Lacuna</h2>
      </div>

      <div className="game-content">
        <div className="sentence">
          {gameData.sentence.split("___").map((part, idx, arr) => (
            <span key={idx}>
              {String(part).toLowerCase()}
              {idx < arr.length - 1 && <span className="blank">___</span>}
            </span>
          ))}
        </div>

        <div className="options">
          {gameData.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-button ${selectedIdx === idx ? (isCorrect ? "correct" : "incorrect") : ""}`}
              onClick={() => handleAnswer(option, idx)}
              disabled={isCorrect === true}
            >
              {String(option).toLowerCase()}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className={`feedback ${isCorrect ? "correct" : "incorrect"}`}>
            {isCorrect ? "Excelente!" : "Incorreto. Tente novamente!"}
          </div>
        )}
      </div>

      <div className="game-actions">
        {showNext && (
          <button className="btn-primary" onClick={() => onComplete(true)}>
            Próximo
          </button>
        )}
      </div>
    </div>
  )
}

export default FillBlankGame
