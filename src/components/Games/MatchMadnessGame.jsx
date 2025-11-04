"use client"

import { useState, useEffect } from "react"
import "../../styles/MatchMadnessGame.css"

function MatchMadnessGame({ gameData, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(gameData.timeLimit)
  const [pairs, setPairs] = useState([])
  const [selected, setSelected] = useState(null)
  const [matched, setMatched] = useState([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const shuffled = [...gameData.pairs].sort(() => Math.random() - 0.5)
    setPairs(shuffled)
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true)
      onComplete(matched.length === gameData.pairs.length, score)
      return
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleClick = (item, side) => {
    if (gameOver) return

    if (selected === null) {
      setSelected({ item, side })
    } else if (selected.side === side) {
      setSelected({ item, side })
    } else {
      if (selected.item.en === item.en) {
        setMatched([...matched, selected.item.en])
        setScore(score + 10)
        setSelected(null)
      } else {
        setScore(Math.max(0, score - 2))
        setTimeout(() => setSelected(null), 500)
      }
    }
  }

  const timeColor = timeLeft > 10 ? "green" : timeLeft > 5 ? "orange" : "red"

  return (
    <div className="game-container match-madness">
      <div className="madness-header">
        <h2>Match Madness - Contra o Tempo!</h2>
        <div className="madness-stats">
          <div className={`timer ${timeColor}`}>⏱️ {timeLeft}s</div>
          <div className="madness-score">⭐ {score}</div>
          <div className="madness-progress">
            {matched.length}/{gameData.pairs.length}
          </div>
        </div>
      </div>

      {!gameOver ? (
        <div className="madness-content">
          <div className="madness-pairs">
            <div className="column english">
              {pairs.map((pair, idx) => (
                <button
                  key={`en_${idx}`}
                  className={`madness-button ${
                    matched.includes(pair.en) ? "matched" : ""
                  } ${selected?.item.en === pair.en && selected?.side === "en" ? "selected" : ""}`}
                  onClick={() => handleClick(pair, "en")}
                  disabled={matched.includes(pair.en)}
                >
                  {String(pair.en).toLowerCase()}
                </button>
              ))}
            </div>

            <div className="column portuguese">
              {pairs.map((pair, idx) => (
                <button
                  key={`pt_${idx}`}
                  className={`madness-button ${
                    matched.includes(pair.en) ? "matched" : ""
                  } ${selected?.item.en === pair.en && selected?.side === "pt" ? "selected" : ""}`}
                  onClick={() => handleClick(pair, "pt")}
                  disabled={matched.includes(pair.en)}
                >
                  {String(pair.pt).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="game-over-screen">
          <h3>{matched.length === gameData.pairs.length ? "Você Venceu! 🎉" : "Tempo Esgotado!"}</h3>
          <p>Score Final: {score}</p>
          <p>
            Pares Encontrados: {matched.length}/{gameData.pairs.length}
          </p>
        </div>
      )}
    </div>
  )
}

export default MatchMadnessGame
