"use client"

import { useState, useEffect } from "react"
import "../../styles/MatchPairsGame.css"

function MatchPairsGame({ gameData, onComplete }) {
  // Listas separadas para cada idioma, embaralhadas independentemente
  const [enItems, setEnItems] = useState([])
  const [ptItems, setPtItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [matched, setMatched] = useState([]) // armazena a chave (en) dos pares já feitos
  const [feedback, setFeedback] = useState("")
  const [completed, setCompleted] = useState(false)

  // Embaralha por idioma e reinicia estado quando o jogo mudar
  useEffect(() => {
    const pairs = gameData.pairs || []
    const shuffle = (arr) => arr.map(v => ({ v, s: Math.random() })).sort((a,b)=>a.s-b.s).map(({v})=>v)

    // cada item terá uma chave compartilhada (usamos a palavra em inglês como id)
    const en = shuffle(pairs.map(p => ({ key: p.en, label: p.en })))
    const pt = shuffle(pairs.map(p => ({ key: p.en, label: p.pt })))

    setEnItems(en)
    setPtItems(pt)
    setSelected(null)
    setMatched([])
    setFeedback("")
    setCompleted(false)
  }, [gameData])

  const handleClick = (item, side) => {
    if (selected === null) {
      setSelected({ key: item.key, side })
    } else if (selected.side === side) {
      // Click on same side, change selection
      setSelected({ key: item.key, side })
    } else {
      // Check if it's a match
      if (selected.key === item.key) {
        setMatched([...matched, item.key])
        setSelected(null)
        setFeedback("Correto!")

        if (matched.length + 1 === (gameData.pairs ? gameData.pairs.length : 0)) {
          setCompleted(true)
        }
      } else {
        setFeedback("Não é um par. Tente novamente!")
        setTimeout(() => {
          setSelected(null)
          setFeedback("")
        }, 1000)
      }
    }
  }

  return (
    <div className="game-container match-pairs">
      <div className="game-header">
        <h2>Combine os Pares</h2>
        <p className="progress">
          {matched.length} de {gameData.pairs.length} pares encontrados
        </p>
      </div>

      <div className="game-content">
        <div className="pairs-container">
          <div className="column english">
            <h3>Inglês</h3>
            <div className="items">
              {enItems.map((item, idx) => (
                <button
                  key={`en_${idx}`}
                  className={`pair-button ${
                    matched.includes(item.key) ? "matched" : ""
                  } ${selected?.key === item.key && selected?.side === "en" ? "selected" : ""}`}
                  onClick={() => handleClick(item, "en")}
                  disabled={matched.includes(item.key) || completed}
                >
                  {String(item.label).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="column portuguese">
            <h3>Português</h3>
            <div className="items">
              {ptItems.map((item, idx) => (
                <button
                  key={`pt_${idx}`}
                  className={`pair-button ${
                    matched.includes(item.key) ? "matched" : ""
                  } ${selected?.key === item.key && selected?.side === "pt" ? "selected" : ""}`}
                  onClick={() => handleClick(item, "pt")}
                  disabled={matched.includes(item.key) || completed}
                >
                  {String(item.label).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {feedback && <div className="feedback">{feedback}</div>}
      </div>

      <div className="game-actions">
        {completed && (
          <button className="btn-primary" onClick={() => onComplete(true)}>
            Próximo
          </button>
        )}
      </div>
    </div>
  )
}

export default MatchPairsGame
