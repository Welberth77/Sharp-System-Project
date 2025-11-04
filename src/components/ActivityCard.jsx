function ActivityCard({ activity }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "concluída":
        return "bg-green-50 border-green-200 text-green-700"
      case "em andamento":
        return "bg-blue-50 border-blue-200 text-blue-700"
      case "pendente":
        return "bg-orange-50 border-orange-200 text-orange-700"
      default:
        return "bg-gray-50 border-gray-200 text-gray-700"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "concluída":
        return "✓ Concluída"
      case "em andamento":
        return "◐ Em Andamento"
      case "pendente":
        return "○ Pendente"
      default:
        return status
    }
  }

  const formatDate = (date) => {
    const d = new Date(date)
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }

  return (
    <div className="group rounded-xl bg-white border-2 border-gray-200 p-6 hover:border-[#283890] hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#283890] transition-colors">
            {activity.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-lg text-xs font-semibold border-2 whitespace-nowrap ml-2 ${getStatusColor(activity.status)}`}
        >
          {getStatusLabel(activity.status)}
        </span>
      </div>

      <div className="pt-4 border-t-2 border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Vencimento:</span>
        <span className="text-sm font-bold text-gray-900">{formatDate(activity.dueDate)}</span>
      </div>
    </div>
  )
}

export default ActivityCard
