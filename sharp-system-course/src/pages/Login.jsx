import React, { useState } from 'react'; // <-- CORREÇÃO 1: useState importado

// Importe a sua logo COM FUNDO TRANSPARENTE
// Ajuste o caminho se você salvou em outro lugar
import logo from '../assets/logo-sharpSystem.jpg';

// ATENÇÃO: As credenciais de teste (HARDCODED)
const TEST_EMAIL = 'teste@sharpsystem.com';
const TEST_PASSWORD = '123456';

// Recebe a função onLoginSuccess como prop
function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Cor hexadecimal azul escuro (usada no BG e Botão)
  const primaryColor = '#283890'; 

  // Função correta de manipulação de envio
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    // LÓGICA DE VALIDAÇÃO DE TESTE
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      // Se as credenciais estiverem corretas, chama a função de sucesso
      onLoginSuccess();
    } else {
      // Se estiverem incorretas, define a mensagem de erro
      setError('E-mail ou senha incorretos. Use teste@sharpsystem.com / 123456');
    }
  };

  return (
    // Container Principal: Ocupa 100% da altura da tela e usa flexbox
    <div className="flex min-h-screen">
      
      {/* Lado Esquerdo (Branding - Fundo Azul Escuro) */}
      <div className="hidden w-1/2 flex-col items-center justify-center space-y-8 bg-[#283890] p-12 text-white lg:flex">
        
        {/* Logo e Nome */}
        <div className="flex flex-col items-center text-center">
          <img 
            src={logo} 
            alt="Sharp System Logo" 
            className="w-48" // Tamanho ajustado
          />
          <span className="mt-8 text-4xl font-bold">
            Sharp System Course
          </span>
        </div>
      </div>
      
      {/* Lado Direito (Formulário - Fundo Cinza Claro) */}
      <div className="w-full bg-[#F5F5F5] p-8 lg:w-1/2 lg:p-16 flex items-center justify-center">
        
        {/* Container do Formulário para Limitar a Largura em Telas Grandes */}
        <div className="w-full max-w-sm">
          
          {/* Títulos do Formulário */}
          <h2 className="text-4xl font-extrabold text-[#283890] mb-2">
            Bem-vindo(a)!
          </h2>
          <p className="mb-10 text-2xl font-semibold text-gray-700">
            Faça seu login.
          </p>

          {/* Mensagem de Erro (se houver) */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm font-medium text-red-700 border border-red-300">
              {error}
            </div>
          )}
          
          {/* CORREÇÃO 2: Usa handleSubmit na submissão do formulário */}
          <form onSubmit={handleSubmit} method="POST">
            
            {/* Campo de E-mail */}
            <div className="mb-5">
              <input
                type="email"
                id="email"
                name="email"
                required
                // CORREÇÃO 3: Conexão do estado e manipulação de mudança
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border-none bg-gray-300 py-3 px-4 text-lg text-gray-900 shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="E-mail"
              />
            </div>
            
            {/* Campo de Senha */}
            <div className="mb-5">
              <input
                type="password"
                id="password"
                name="password"
                required
                // CORREÇÃO 3: Conexão do estado e manipulação de mudança
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border-none bg-gray-300 py-3 px-4 text-lg text-gray-900 shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Senha"
              />
            </div>
            
            {/* Esqueceu a senha? e Cadastre-se aqui */}
            <div className="mb-8 flex justify-between">
              <a 
                href="#" 
                className="text-base font-semibold text-blue-600 hover:underline"
              >
                Esqueceu sua senha?
              </a>
              <a 
                href="#" 
                className="text-base font-semibold text-blue-600 hover:underline"
              >
                Cadastre-se aqui!
              </a>
            </div>
            
            {/* Botão de Login */}
            <div>
              <button
                type="submit"
                className={`flex w-full justify-center rounded-lg bg-[${primaryColor}] px-4 py-3 text-lg font-bold uppercase tracking-wider text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
              >
                Entrar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;