import './App.css';
import { Route, Routes } from 'react-router-dom';
import AppNavigation from './components/app/AppNavigation';
import Home from './components/app/Home';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import newGame from './components/games/newGame';
import joinGame from './components/games/joinGame';
import { AuthContext } from './components/auth/AuthContext';
import { useContext, useEffect } from 'react';

function App() {

  const { token, setTokenValue } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      setTokenValue(token);
    }
  }, [token, setTokenValue]);


  return (
    <Routes>
      <Route path="/" element={
        <>
          <AppNavigation />
          <Home />
        </>
      } />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<SignUpForm />} />
      <Route path="/games/new" element={<newGame />} />
      <Route path="/games/join" element={<joinGame />} />
    </Routes>
  );
}

export default App;
