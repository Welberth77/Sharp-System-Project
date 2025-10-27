import { useState } from 'react'
import './App.css'
import Login from './pages/Login' // Assumindo que o nome do arquivo é Login.jsx
import DashboardAluno from './pages/DashboardAluno';

function App() {

const [isLoggedIn, setIsLoggedIn] = useState(false);
  // A função passada para o login (chama setIsLoggedIn(true))
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  // A função de logout (chama setIsLoggedIn(false))
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <DashboardAluno onLogout={handleLogout} />;
  } else {
  // Passamos a função de sucesso aqui
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }
}

export default App