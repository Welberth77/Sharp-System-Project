

function Header({ studentName = '[NOME DO ALUNO]' }) {
  return (
    // Barra superior com fundo branco e leve sombra
    <header className="flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm">
      
      {/* Nome de Usuário (Centralizado ou à Esquerda) */}
      <h1 className="text-lg font-semibold uppercase text-gray-700">
        BEM VINDO, {studentName}
      </h1>
      
      {/* Foto do Perfil (Direita) */}
      <div className="flex items-center space-x-3">
        {/* Placeholder para a foto de perfil */}
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
        </div>
      </div>
    </header>
  );
}

export default Header;