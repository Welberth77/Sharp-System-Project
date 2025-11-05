"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import ActivityCard from "../components/ActivityCard"
import StreakDisplay from "../components/StreakDisplay"
import GameModeSelector from "../components/GameModeSelector"
import TranslationBankGame from "../components/Games/TranslationBankGame"
import MatchPairsGame from "../components/Games/MatchPairsGame"
import MultipleChoiceGame from "../components/Games/MultipleChoiceGame"
import FillBlankGame from "../components/Games/FillBlankGame"
import FreeTranslationGame from "../components/Games/FreeTranslationGame"
import MatchMadnessGame from "../components/Games/MatchMadnessGame"
import GameProgressStats from "../components/GameProgressStats"
import { getRandomGames, initializeProgressData, GAME_TYPES, gameLibrary } from "../utils/GameData"
import "../styles/ChallengeSelectorGame.css"

function Atividades({ onNavigate, onLogout }) {
  const [gameMode, setGameMode] = useState(null) // null | 'daily' | 'free'
  const [currentGameIndex, setCurrentGameIndex] = useState(0)
  const [dailyGames, setDailyGames] = useState([])
  const [selectedGameType, setSelectedGameType] = useState(null)
  const [freeGameCounter, setFreeGameCounter] = useState(0)

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("gameProgress")
    return saved ? JSON.parse(saved) : initializeProgressData()
  })

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("gameStreak")
    return saved ? JSON.parse(saved) : { currentStreak: 0, lastPlayedDate: null }
  })

  useEffect(() => {
    localStorage.setItem("gameProgress", JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    localStorage.setItem("gameStreak", JSON.stringify(streak))
  }, [streak])

  const handleStartDaily = () => {
    const today = new Date().toDateString()

    // Verificar se já jogou hoje
    if (streak.lastPlayedDate === today && progress.streakData.dailyGamesCompleted >= 2) {
      alert("Você já completou sua sequência diária! Volte amanhã!")
      return
    }

    const games = getRandomGames(2)
    setDailyGames(games)
    setCurrentGameIndex(0)
    setGameMode("daily")
  }

  const handleStartFree = () => {
    setGameMode("free")
    setSelectedGameType(null)
  }

  const handleGameComplete = (isCorrect) => {
    const currentGame = gameMode === "daily" ? dailyGames[currentGameIndex] : null
    const gameType = gameMode === "daily" ? currentGame?.type : selectedGameType

    setProgress((prev) => {
      const updated = { ...prev }
      updated.totalGamesPlayed++

      if (isCorrect) {
        updated.totalCorrectAnswers++
        updated.gameStats[gameType].correct++
      } else {
        updated.totalWrongAnswers++
        updated.gameStats[gameType].wrong++
      }
      updated.gameStats[gameType].played++

      return updated
    })
  }

  const handleProceedToNext = () => {
    if (gameMode === "daily") {
      if (currentGameIndex < dailyGames.length - 1) {
        setCurrentGameIndex(currentGameIndex + 1)
      } else {
        // Completou os 2 jogos da sequência
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()

        setStreak((prev) => ({
          currentStreak: prev.lastPlayedDate === yesterday ? prev.currentStreak + 1 : 1,
          lastPlayedDate: today,
        }))

        setProgress((prev) => ({
          ...prev,
          streakData: {
            currentStreak: streak.currentStreak + 1,
            lastPlayedDate: today,
            dailyGamesCompleted: 2,
            dailyGamesRequired: 2,
          },
        }))

        alert("Parabéns! Você completou sua sequência diária! 🔥")
        setGameMode(null)
        setDailyGames([])
      }
    }
  }

  const renderGame = () => {
    let gameData
    let gameType

    if (gameMode === "daily") {
      const current = dailyGames[currentGameIndex]
      gameData = current.game
      gameType = current.type
    } else if (gameMode === "free" && selectedGameType) {
      const games = gameLibrary[selectedGameType]
      gameData = games[Math.floor(Math.random() * games.length)]
      gameType = selectedGameType
    } else {
      return null
    }

    let onCompleteCallback = handleGameComplete

    if (gameType === GAME_TYPES.MATCH_MADNESS) {
      if (gameMode === "daily") {
        // Embarcar progresso e avançar para o próximo ao concluir no modo diário
        onCompleteCallback = (isComplete) => {
          handleGameComplete(isComplete)
          handleProceedToNext()
        }
      } else if (gameMode === "free") {
        // No modo livre, avançar para um novo desafio do mesmo tipo
        onCompleteCallback = (isComplete) => {
          handleGameComplete(isComplete)
          setFreeGameCounter((c) => c + 1)
        }
      }
    }

    const commonProps = { gameData, onComplete: onCompleteCallback }

    switch (gameType) {
      case GAME_TYPES.TRANSLATION_BANK:
        return <TranslationBankGame key={`${gameMode}-${gameType}-${currentGameIndex}-${freeGameCounter}`} {...commonProps} />
      case GAME_TYPES.MATCH_PAIRS:
        return <MatchPairsGame key={`${gameMode}-${gameType}-${currentGameIndex}-${freeGameCounter}`} {...commonProps} />
      case GAME_TYPES.MULTIPLE_CHOICE:
        return <MultipleChoiceGame key={`${gameMode}-${gameType}-${currentGameIndex}-${freeGameCounter}`} {...commonProps} />
      case GAME_TYPES.FILL_BLANK:
        return <FillBlankGame key={`${gameMode}-${gameType}-${currentGameIndex}-${freeGameCounter}`} {...commonProps} />
      case GAME_TYPES.FREE_TRANSLATION:
        return <FreeTranslationGame key={`${gameMode}-${gameType}-${currentGameIndex}-${freeGameCounter}`} {...commonProps} />
      case GAME_TYPES.MATCH_MADNESS:
        return <MatchMadnessGame key={`${gameMode}-${gameType}-${currentGameIndex}-${freeGameCounter}`} {...commonProps} />
      default:
        return null
    }
  }

  const activities = [
    {
      id: 1,
      title: "Unidade 5 - Verbos",
      dueDate: "2025-11-10",
      status: "pendente",
      description: "Conjugação de verbos no presente",
    },
    {
      id: 2,
      title: "Unidade 4 - Vocabulário",
      dueDate: "2025-11-05",
      status: "concluída",
      description: "Aprenda 50 novas palavras",
    },
    {
      id: 3,
      title: "Unidade 6 - Gramática",
      dueDate: "2025-11-15",
      status: "pendente",
      description: "Estrutura de sentenças complexas",
    },
    {
      id: 4,
      title: "Quiz - Revisão Geral",
      dueDate: "2025-11-12",
      status: "em andamento",
      description: "Teste seus conhecimentos",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onNavigate={onNavigate} currentPage="atividades" onLogout={onLogout} />

      <div className="flex-1 flex flex-col">
        <Header studentName="JOÃO SILVA" />

        <main className="flex-1 overflow-y-auto p-8">
          {gameMode === null ? (
            <>
              {/* Streak Display */}
              <StreakDisplay streak={streak.currentStreak} totalPoints={progress.totalCorrectAnswers} />

              {/* Game Mode Selector */}
              <section className="mb-12">
                <GameModeSelector
                  onModeSelect={(mode) => (mode === "daily" ? handleStartDaily() : handleStartFree())}
                  streak={streak.currentStreak}
                />
              </section>

              {/* Progress Stats */}
              <section className="mb-12">
                <GameProgressStats progress={progress} />
              </section>

              {/* Activities Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Atividades do Professor</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </section>
            </>
          ) : gameMode === "daily" ? (
            <div className="game-session">
              <div className="game-session-header">
                <h2>
                  Sequência Diária - Jogo {currentGameIndex + 1} de {dailyGames.length}
                </h2>
                <button
                  className="btn-back"
                  onClick={() => {
                    setGameMode(null)
                    setDailyGames([])
                  }}
                >
                  ← Voltar
                </button>
              </div>
              {renderGame()}
              {currentGameIndex < dailyGames.length - 1 && (
                <button className="btn-next" onClick={handleProceedToNext}>
                  Próximo
                </button>
              )}
            </div>
          ) : gameMode === "free" && !selectedGameType ? (
            <div className="free-challenge-selector">
              <div className="selector-header">
                <h2>Escolha um Desafio</h2>
                <button className="btn-back" onClick={() => setGameMode(null)}>
                  ← Voltar
                </button>
              </div>
              <div className="challenge-grid">
                {Object.entries(GAME_TYPES).map(([, type]) => (
                  <button key={type} className="challenge-card" onClick={() => setSelectedGameType(type)}>
                    <h3>
                      {type === GAME_TYPES.TRANSLATION_BANK
                        ? "Tradução com Banco"
                        : type === GAME_TYPES.MATCH_PAIRS
                          ? "Combinar Pares"
                          : type === GAME_TYPES.MULTIPLE_CHOICE
                            ? "Múltipla Escolha"
                            : type === GAME_TYPES.FILL_BLANK
                              ? "Preencher Lacuna"
                              : type === GAME_TYPES.FREE_TRANSLATION
                                ? "Tradução Livre"
                                : "Match Madness"}
                    </h3>
                  </button>
                ))}
              </div>
            </div>
          ) : gameMode === "free" && selectedGameType ? (
            <div className="game-session">
              <div className="game-session-header">
                <h2>Desafio Livre</h2>
                <button className="btn-back" onClick={() => setSelectedGameType(null)}>
                  ← Voltar
                </button>
              </div>
              {renderGame()}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}

export default Atividades
