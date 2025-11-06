import "../styles/GameProgressStats.css"

function GameProgressStats({ progress }) {
  const accuracy =
    progress.totalCorrectAnswers + progress.totalWrongAnswers > 0
      ? Math.round((progress.totalCorrectAnswers / (progress.totalCorrectAnswers + progress.totalWrongAnswers)) * 100)
      : 0

  const gameTypeNames = {
    translation_bank: "Match-Frase",
    match_pairs: "Par Ideal",
    multiple_choice: "Escolha Certa",
    fill_blank: "Complete a Frase",
    free_translation: "Tradução Livre",
    match_madness: "Corrida dos Pares",
  }

  return (
    <div className="progress-stats">
      <div className="stats-header">
        <h3>Seu Progresso</h3>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-label">Total de Jogos</div>
          <div className="stat-value">{progress.totalGamesPlayed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Acertos</div>
          <div className="stat-value correct">{progress.totalCorrectAnswers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Erros</div>
          <div className="stat-value wrong">{progress.totalWrongAnswers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Taxa de Acerto</div>
          <div className="stat-value accuracy">{accuracy}%</div>
        </div>
      </div>

      <div className="stats-breakdown">
        <h4>Estatísticas por Jogo</h4>
        <div className="game-stats-grid">
          {Object.entries(progress.gameStats).map(([gameType, stats]) => (
            <div key={gameType} className="game-stat-item">
              <h5>{gameTypeNames[gameType]}</h5>
              <div className="stat-mini">
                <span>Jogado: {stats.played}</span>
                <span className="correct">✓ {stats.correct}</span>
                <span className="wrong">✗ {stats.wrong}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GameProgressStats
