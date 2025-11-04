"use client"
import "../styles/GameModeSelector.css"

function GameModeSelector({ onModeSelect, streak }) {
  return (
    <div className="game-mode-selector">
      <div className="mode-card mode-card-daily">
        <div className="mode-header daily">
          <div className="streak-badge">
            <span className="fire-icon">🔥</span>
            <span className="streak-count">{streak}</span>
          </div>
          <h3>Sequência Diária</h3>
        </div>
        <div className="mode-content">
          <p className="mode-description">Complete 2 jogos aleatórios para manter sua sequência</p>
          <ul className="mode-features">
            <li>✓ Ganhe pontos extras</li>
            <li>✓ Mantenha sua sequência</li>
            <li>✓ Desafios variados</li>
          </ul>
        </div>
        <button type="button" className="mode-button daily-btn" onClick={() => onModeSelect("daily")}>
          Começar Sequência
        </button>
      </div>

      <div className="mode-card mode-card-free">
        <div className="mode-header free">
          <h3>Desafios Livres</h3>
        </div>
        <div className="mode-content">
          <p className="mode-description">Jogue quantos desafios quiser, sem limite</p>
          <ul className="mode-features">
            <li>✓ Treinar livremente</li>
            <li>✓ Escolher tipo de jogo</li>
            <li>✓ Sem limite de tempo</li>
          </ul>
        </div>
        <button type="button" className="mode-button free-btn" onClick={() => onModeSelect("free")}>
          Explorar Desafios
        </button>
      </div>
    </div>
  )
}

export default GameModeSelector
