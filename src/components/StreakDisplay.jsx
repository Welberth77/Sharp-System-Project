function StreakDisplay({ streak, totalPoints }) {
  return (
    <div className="mb-10 grid gap-4 md:grid-cols-3">
      {/* Streak Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-6 border-2 border-orange-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mt-16 opacity-40"></div>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase text-orange-600 mb-2">Sequência Atual</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-orange-600">{streak}</span>
            <span className="text-lg text-orange-500 mb-2">dias</span>
          </div>
          <p className="text-xs text-orange-500 mt-3">Continue jogando todos os dias!</p>
        </div>
      </div>

      {/* Points Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-2 border-blue-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-40"></div>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase text-blue-600 mb-2">Pontos Acumulados</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-blue-600">{totalPoints}</span>
            <span className="text-lg text-blue-500 mb-2">pts</span>
          </div>
          <p className="text-xs text-blue-500 mt-3">Ganhe mais pontos jogando!</p>
        </div>
      </div>

      {/* Level Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 border-2 border-purple-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16 opacity-40"></div>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase text-purple-600 mb-2">Nível</p>
          <div className="flex items-center gap-3">
            <span className="text-5xl font-bold text-purple-600">{Math.floor(totalPoints / 500) + 1}</span>
            <div className="flex-1">
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(totalPoints % 500) / 5}%` }}
                ></div>
              </div>
              <p className="text-xs text-purple-500 mt-1">{totalPoints % 500}/500</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreakDisplay
