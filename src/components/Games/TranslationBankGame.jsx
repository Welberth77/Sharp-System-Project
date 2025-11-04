"use client"

import { useEffect, useState } from "react"
import "../../styles/TranslationBankGame.css"
import { gameLibrary } from "../../utils/gameData"

function TranslationBankGame({ gameData, onComplete }) {
  const [selected, setSelected] = useState([])
  const [remaining, setRemaining] = useState(() => buildShuffledBank(gameData))
  const [isCorrect, setIsCorrect] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [draggedWord, setDraggedWord] = useState(null)
  const [dragOverTranslation, setDragOverTranslation] = useState(false)
  const [dragOverBank, setDragOverBank] = useState(false)
  const [hoveringCompletedPhrase, setHoveringCompletedPhrase] = useState(false)
  const [draggingFromTranslation, setDraggingFromTranslation] = useState(false)

  useEffect(() => {
    setSelected([])
    setRemaining(buildShuffledBank(gameData))
    setIsCorrect(null)
    setFeedback("")
  }, [gameData])

  const handleWordClick = (word, index) => {
    const newSelected = [...selected, { word, index }]
    setSelected(newSelected)

    const newRemaining = remaining.filter((_, i) => i !== index)
    setRemaining(newRemaining)
  }

  const handleDragStart = (e, word, index, source) => {
    if (isCorrect === true) return
    e.dataTransfer.effectAllowed = "move"
    if (source === "bank") {
      setDraggedWord({ word, index, source })
    } else {
      // source: translation — use selPos (posição no array selected)
      setDraggedWord({ word, selPos: index, source: "translation" })
    }
  }

  const handleDragEnd = () => {
    setDraggedWord(null)
  }

  const handleDragOverTranslation = (e) => {
    e.preventDefault()
    setDragOverTranslation(true)
  }

  const handleDragLeaveTranslation = () => {
    setDragOverTranslation(false)
  }

  const handleDropTranslation = (e) => {
    e.preventDefault()
    setDragOverTranslation(false)

    // Adiciona palavra do banco para a tradução
    if (draggedWord && draggedWord.source === "bank") {
      const newSelected = [...selected, draggedWord]
      setSelected(newSelected)

      const newRemaining = remaining.filter((_, i) => i !== draggedWord.index)
      setRemaining(newRemaining)
    } else if (draggedWord && draggedWord.source === "translation") {
      // Arrastou de volta para a própria área de tradução — não faz nada
    }

    setDraggedWord(null)
  }

  const handleUndo = () => {
    if (selected.length > 0) {
      const lastSelected = selected[selected.length - 1]
      setSelected(selected.slice(0, -1))
      setRemaining([...remaining, lastSelected.word])
    }
  }

  const handleSubmit = () => {
    const userAnswer = selected.map((s) => s.word)
    const target = stripPunctuation(gameData.correct)
    const toLowerArr = (arr) => arr.map((w) => String(w).toLowerCase())
    const isAnswerCorrect = JSON.stringify(toLowerArr(userAnswer)) === JSON.stringify(toLowerArr(target))

    setIsCorrect(isAnswerCorrect)
    setFeedback(isAnswerCorrect ? "Correto! Parabéns!" : "Resposta incorreta. Tente novamente!")
  }

  const handleDragStartFromBrokenPhrase = (e, word, index) => {
    if (isCorrect === true) return
    e.dataTransfer.effectAllowed = "move"
    setDraggedWord({ word, selPos: index, source: "translation" })
    setDraggingFromTranslation(true)
  }

  const handleDragOverBank = (e) => {
    e.preventDefault()
    setDragOverBank(true)
  }

  const handleDragLeaveBank = () => {
    setDragOverBank(false)
  }

  const handleDropBank = (e) => {
    e.preventDefault()
  setDragOverBank(false)

    // Remove palavra da tradução e devolve ao banco
    if (draggedWord && draggedWord.source === "translation") {
      const pos = draggedWord.selPos
      if (typeof pos === "number" && pos >= 0 && pos < selected.length) {
        const removed = selected[pos]
        const newSelected = selected.filter((_, i) => i !== pos)
        setSelected(newSelected)
        setRemaining([...remaining, removed.word])
      }
    }

    setDraggedWord(null)
    setDraggingFromTranslation(false)
  }

  return (
    <div className="game-container translation-bank">
      <div className="game-header">
        <h2>Tradução com Banco de Palavras</h2>
        <p className="portuguese-phrase">{gameData.portuguese}</p>
      </div>

      <div className="game-content">
        <div
          className={`selected-sequence ${dragOverTranslation ? "drag-over" : ""}`}
          onDragOver={handleDragOverTranslation}
          onDragLeave={handleDragLeaveTranslation}
          onDrop={handleDropTranslation}
        >
          <div className="sequence-label">Sua tradução:</div>
          {(() => {
            const expectedLen = stripPunctuation(gameData.correct).length
            const fullySelectedOuter = selected.length === expectedLen
            return (
              <div
                className={`sequence-words${fullySelectedOuter ? " single-block" : ""}`}
                onMouseLeave={() => {
                  if (!draggingFromTranslation) setHoveringCompletedPhrase(false)
                }}
              >
                {(() => {
                  const expectedLen = stripPunctuation(gameData.correct).length
                  const fullySelected = selected.length === expectedLen
                  if (selected.length === 0) {
                    return <span className="placeholder">Clique nas palavras na ordem correta</span>
                  }

                  const words = selected.map((s) => String(s.word).toLowerCase())
                  const capFirst = (str) => (str.length ? str[0].toUpperCase() + str.slice(1) : str)

                  if (fullySelected) {
                    let sentence = words.join(" ")
                    sentence = capFirst(sentence)
                    if (!sentence.endsWith(".")) sentence += "."

                    if (hoveringCompletedPhrase) {
                      return words.map((w, idx) => (
                        <span
                          key={idx}
                          className="word-block word-block-breakable"
                          draggable
                          onDragStart={(e) => handleDragStartFromBrokenPhrase(e, w, idx)}
                          onDragEnd={handleDragEnd}
                        >
                          {idx === 0 ? (w.length ? w[0].toUpperCase() + w.slice(1) : w) : w}
                        </span>
                      ))
                    }

                    return (
                      <span
                        className="word-block word-block-completed"
                        draggable
                        onMouseEnter={() => setHoveringCompletedPhrase(true)}
                        onMouseLeave={() => setHoveringCompletedPhrase(false)}
                        title="Passe o mouse para remover uma palavra"
                      >
                        {sentence}
                      </span>
                    )
                  }

                  return words.map((w, idx) => (
                    <span
                      key={idx}
                      className="word-block"
                      draggable
                      onDragStart={(e) => handleDragStart(e, w, idx, "translation")}
                      onDragEnd={handleDragEnd}
                    >
                      {idx === 0 ? (w.length ? w[0].toUpperCase() + w.slice(1) : w) : w}
                    </span>
                  ))
                })()}
              </div>
            )
          })()}
        </div>

        <div className="word-bank">
          <div className="word-bank-label">Banco de Palavras:</div>
          <div
            className={`words-grid${dragOverBank ? " drag-over" : ""}`}
            onDragOver={handleDragOverBank}
            onDragLeave={handleDragLeaveBank}
            onDrop={handleDropBank}
          >
            {remaining.map((word, idx) => (
              <button
                key={idx}
                className="word-button"
                onClick={() => handleWordClick(word, idx)}
                draggable
                onDragStart={(e) => handleDragStart(e, word, idx, "bank")}
                onDragEnd={handleDragEnd}
                disabled={isCorrect === true}
              >
                {String(word).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {feedback && <div className={`feedback ${isCorrect ? "correct" : "incorrect"}`}>{feedback}</div>}
      </div>

      <div className="game-actions">
        <button className="btn-secondary" onClick={handleUndo} disabled={selected.length === 0 || isCorrect === true}>
          Desfazer
        </button>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={selected.length !== stripPunctuation(gameData.correct).length || isCorrect === true}
        >
          Enviar Resposta
        </button>
        {isCorrect === true && (
          <button className="btn-primary" onClick={() => onComplete(true)}>
            Próximo
          </button>
        )}
      </div>
    </div>
  )
}

export default TranslationBankGame

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function stripPunctuation(arr) {
  const PUNCT = new Set(["."])
  return (Array.isArray(arr) ? arr : []).filter((w) => !PUNCT.has(w))
}

function buildShuffledBank(gameData) {
  const correct = stripPunctuation(gameData.correct)
  const correctSet = new Set(correct)

  const baseSet = new Set(stripPunctuation(gameData.words))
  correct.forEach((w) => baseSet.add(w))
  let baseBank = Array.from(baseSet)

  const currentIncorrect = baseBank.filter((w) => !correctSet.has(w))

  let desiredIncorrect = randomInt(4, 6)
  if (currentIncorrect.length > 6) desiredIncorrect = 6

  const allTB = gameLibrary && Array.isArray(gameLibrary.translation_bank) ? gameLibrary.translation_bank : []
  const allWords = allTB.flatMap((tb) => (Array.isArray(tb.words) ? stripPunctuation(tb.words) : []))
  const decoyPool = Array.from(new Set(allWords.filter((w) => w && !correctSet.has(w) && !baseSet.has(w))))

  if (currentIncorrect.length < desiredIncorrect) {
    const need = desiredIncorrect - currentIncorrect.length
    const picked = shuffleArray(decoyPool).slice(0, need)
    baseBank = [...correct, ...currentIncorrect, ...picked]
  } else if (currentIncorrect.length > desiredIncorrect) {
    const trimmedIncorrect = shuffleArray(currentIncorrect).slice(0, desiredIncorrect)
    baseBank = [...correct, ...trimmedIncorrect]
  }

  return shuffleArray(baseBank)
}
