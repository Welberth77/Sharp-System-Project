function HeaderAdmin({ adminName = 'ADMINISTRADOR' }) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm">
      
      <h1 className="text-lg font-semibold uppercase text-gray-700">
        ÁREA ADMINISTRATIVA - CADASTRO DE ALUNO
      </h1>
      
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-600">{adminName}</span>
        
        {/* Placeholder da Foto de Perfil (Sem Ícone) */}
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
          <div className="flex h-full w-full items-center justify-center text-xl font-bold text-gray-500 bg-gray-300">
            A
          </div> 
        </div>
      </div>
    </header>
  );
}

export default HeaderAdmin;