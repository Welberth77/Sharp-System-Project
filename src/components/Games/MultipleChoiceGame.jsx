"use client"

import { useEffect, useState } from "react"
import "../../styles/MultipleChoiceGame.css"

function MultipleChoiceGame({ gameData, onComplete }) {
  const [selected, setSelected] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [showNext, setShowNext] = useState(false)

  // Reset state whenever a new question arrives
  useEffect(() => {
    setSelected(null)
    setIsAnswered(false)
    setIsCorrect(null)
    setShowNext(false)
  }, [gameData?.id, gameData?.question])

  const normalize = (s) => String(s ?? "").toLowerCase()

  const handleAnswer = (option) => {
    if (isAnswered) return

    setSelected(option)
    const correct = normalize(option) === normalize(gameData.correct)
    setIsCorrect(correct)

    if (correct) {
      // lock inputs and show next button
      setIsAnswered(true)
      setShowNext(true)
    } else {
      // allow reattempts: briefly show feedback, then clear selection
      setTimeout(() => {
        setSelected(null)
        setIsCorrect(null)
      }, 800)
    }
  }

  return (
    <div className="game-container multiple-choice">
      <div className="game-header">
        <h2>Escolha Certa</h2>
      </div>

      <div className="game-content">
        <div className="question">
          <p>{gameData.question}</p>
        </div>

        <div className="options">
          {gameData.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-button ${selected === option ? (isCorrect ? "correct" : "incorrect") : ""}`}
              onClick={() => handleAnswer(option)}
              disabled={isAnswered}
            >
              <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
              <span className="option-text">{String(option).toLowerCase()}</span>
            </button>
          ))}
        </div>

        {(isCorrect === true || isCorrect === false) && (
          <div className={`feedback ${isCorrect ? "correct" : "incorrect"}`}>
            {isCorrect ? "Parabéns! Resposta correta!" : "Resposta incorreta. Tente novamente!"}
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

export default MultipleChoiceGame
