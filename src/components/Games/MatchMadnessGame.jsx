"use client"

import { useState, useEffect } from "react"
import "../../styles/MatchMadnessGame.css"

function MatchMadnessGame({ gameData, onComplete }) {
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(gameData.timeLimit)
  const [enItems, setEnItems] = useState([])
  const [ptItems, setPtItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [matched, setMatched] = useState([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // Inicializa/embaralha listas ao carregar ou quando o desafio muda
  useEffect(() => {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)
    setEnItems(shuffle(gameData.pairs))
    setPtItems(shuffle(gameData.pairs))
    setSelected(null)
    setMatched([])
    setScore(0)
    setTimeLeft(gameData.timeLimit)
    setGameStarted(false)
    setGameOver(false)
  }, [gameData])

  useEffect(() => {
  if (!gameStarted || gameOver) return

    if (timeLeft <= 0) {
      setGameOver(true)
      return
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, gameStarted, gameOver])

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleClick = (item, side) => {
    if (gameOver || !gameStarted) return

    if (selected === null) {
      setSelected({ item, side })
    } else if (selected.side === side) {
      setSelected({ item, side })
    } else {
      if (selected.item.en === item.en) {
        const newMatched = [...matched, selected.item.en]
        setMatched(newMatched)
        setScore(score + 10)
        setSelected(null)
        // Se completo, finaliza jogo e para o timer
        if (newMatched.length === gameData.pairs.length) {
          setGameOver(true)
        }
      } else {
        setScore(Math.max(0, score - 2))
        setTimeout(() => setSelected(null), 500)
      }
    }
  }

  const handleNextChallenge = () => {
    const isComplete = matched.length === gameData.pairs.length
    onComplete(isComplete, score)
  }

  const timeColor = timeLeft > 10 ? "green" : timeLeft > 5 ? "orange" : "red"

  return (
    <div className="game-container match-madness">
      <div className="madness-header">
        <h2>Corrida dos Pares</h2>
        {gameStarted && (
          <div className="madness-stats">
            <div className={`timer ${timeColor}`}>⏱️ {timeLeft}s</div>
            <div className="madness-score">⭐ {score}</div>
            <div className="madness-progress">
              {matched.length}/{gameData.pairs.length}
            </div>
          </div>
        )}
      </div>

      {!gameStarted && !gameOver ? (
        <div className="madness-start-screen">
          <div className="start-content">
            <h3>Prepare-se para o Desafio!</h3>
            <p>Combine as palavras em inglês com suas traduções em português o mais rápido possível!</p>
            <div className="blurred-preview">
              <div className="column english">
              {enItems.slice(0, 3).map((pair, idx) => (
                  <div key={`en_preview_${idx}`} className="madness-button-preview blurred">
                    {String(pair.en).toLowerCase()}
                  </div>
                ))}
                <div className="preview-dots">...</div>
              </div>

              <div className="column portuguese">
                {ptItems.slice(0, 3).map((pair, idx) => (
                  <div key={`pt_preview_${idx}`} className="madness-button-preview blurred">
                    {String(pair.pt).toLowerCase()}
                  </div>
                ))}
                <div className="preview-dots">...</div>
              </div>
            </div>
            <button className="btn-start-game" onClick={handleStartGame}>
              🎮 Começar Desafio
            </button>
          </div>
        </div>
      ) : !gameOver ? (
        <div className="madness-content">
          <div className="madness-pairs">
            <div className="column english">
              {enItems.map((pair, idx) => (
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
              {ptItems.map((pair, idx) => (
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
          <button className="btn-next-challenge" onClick={handleNextChallenge}>
            Próximo Desafio →
          </button>
        </div>
      )}
    </div>
  )
}

export default MatchMadnessGame
