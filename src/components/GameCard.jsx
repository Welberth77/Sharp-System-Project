"use client"

import { useState } from "react"
import "../styles/GameCard.css"

function GameCard({ onGameComplete, isCompleted }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const questions = [
    {
      question: 'Qual é a tradução de "Hello"?',
      options: ["Oi", "Adeus", "Bem-vindo", "Obrigado"],
      correct: 0,
    },
    {
      question: 'Como se diz "Thank you" em português?',
      options: ["Por favor", "Obrigado", "Desculpe", "Tudo bem"],
      correct: 1,
    },
    {
      question: 'Qual é a forma correta do verbo "to be" no presente com "I"?',
      options: ["Am", "Is", "Are", "Be"],
      correct: 0,
    },
    {
      question: 'O que significa "Goodbye"?',
      options: ["Bom dia", "Boa noite", "Adeus", "Olá"],
      correct: 2,
    },
    {
      question: 'Como você diz "Please" em português?',
      options: ["Por favor", "Obrigado", "Desculpe", "Bem-vindo"],
      correct: 0,
    },
  ]

  const startGame = () => {
    setIsPlaying(true)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
  }

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 100)
    }
    setShowResult(true)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowResult(false)
    } else {
      endGame()
    }
  }

  const endGame = () => {
    onGameComplete(score)
    setIsPlaying(false)
    setScore(0)
  }

  if (isCompleted && !isPlaying) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 p-8 text-center">
        <p className="text-lg font-semibold text-green-700 mb-2">Parabéns!</p>
        <p className="text-sm text-green-600">
          Você já completou o jogo diário de hoje. Volte amanhã para manter sua sequência!
        </p>
      </div>
    )
  }

  if (!isPlaying) {
    return (
      <div
        className="rounded-2xl bg-gradient-to-br from-[#283890] to-indigo-900 p-8 text-white relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300"
        onClick={startGame}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-2">Jogo Diário</h3>
              <p className="text-indigo-100 text-sm">
                5 questões rápidas para testar seus conhecimentos. Ganhe 100 pontos por resposta correta!
              </p>
              <button className="mt-6 px-8 py-3 bg-white text-[#283890] font-bold rounded-xl hover:bg-gray-100 transition-colors duration-200">
                Jogar Agora
              </button>
            </div>
            <div className="text-6xl hidden md:block opacity-20">🎮</div>
          </div>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="rounded-2xl bg-white border-2 border-gray-200 p-8 shadow-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold text-gray-600">
            Questão {currentQuestion + 1} de {questions.length}
          </p>
          <p className="text-sm font-bold text-[#283890]">{score} pontos</p>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#283890] to-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">{questions[currentQuestion].question}</h3>

        {/* Options */}
        <div className="grid gap-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`p-4 text-left rounded-xl font-semibold text-lg transition-all duration-200 ${
                !showResult
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-900 cursor-pointer border-2 border-gray-200"
                  : index === questions[currentQuestion].correct
                    ? "bg-green-100 text-green-700 border-2 border-green-500"
                    : "bg-gray-100 text-gray-600 border-2 border-gray-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Result Message & Next Button */}
      {showResult && (
        <div className="flex items-center justify-between">
          <p
            className={`font-semibold text-lg ${
              questions[currentQuestion].options.indexOf(questions[currentQuestion].correct) ===
              questions[currentQuestion].correct
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {questions[currentQuestion].correct ===
            questions[currentQuestion].options.indexOf(questions[currentQuestion].correct)
              ? "✓ Correto!"
              : "✗ Incorreto"}
          </p>
          <button
            onClick={nextQuestion}
            className="px-8 py-2 bg-[#283890] text-white font-bold rounded-lg hover:bg-indigo-900 transition-colors duration-200"
          >
            {currentQuestion === questions.length - 1 ? "Finalizar" : "Próxima"}
          </button>
        </div>
      )}
    </div>
  )
}

export default GameCard
