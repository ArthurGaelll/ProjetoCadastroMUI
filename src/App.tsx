import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CadastroPage from './pages/Cadastro';
import LoginPage from './pages/Login'; // Importando a tela de login
import InicialPage from './pages/Inicial';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota padrão redireciona para o cadastro */}
        <Route path="/" element={<Navigate to="/cadastro" />} />
        
        {/* Nossas duas páginas principais */}
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inicial" element={<InicialPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;