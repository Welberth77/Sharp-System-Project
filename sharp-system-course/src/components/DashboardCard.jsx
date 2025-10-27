
// Removida a desestruturação de 'icon: Icon' e o prop 'colorClass' não é mais necessário para o ícone
function DashboardCard({ title, value }) { 
  return (
    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">{title}</h3>
      {/* Removido o 'flex items-center space-x-4' para focar apenas no valor */}
      <div className="flex items-center"> 
        {/* Ícone removido: {Icon && <Icon className={`h-8 w-8 ${colorClass}`} />} */}
        <p className="text-3xl font-bold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default DashboardCard;