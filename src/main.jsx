import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import RootLayout from './components/app/RootLayout'
import LoginForm from './components/auth/LoginForm'
import SignUpForm from './components/auth/SignUpForm'
import AuthLayout from './components/auth/AuthLayout'
import Verificate from './components/auth/Verificate'
import NewGame from './components/games/newGame'
import JoinGame from './components/games/joinGame'
import Playgame from './components/games/playGame'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthProvider from './components/auth/AuthContext'
import TermsAndConditions from './components/app/Terms'
import { ThemeProvider } from './contexts/ThemeContext.jsx'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: 'auth/',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginForm />,
          },
          {
            path: 'signup',
            element: <SignUpForm />,
          },
        ]
      },
      {
        path: '/terms',
        element: <TermsAndConditions />,
      },
      { 
        path: '/verifyEmail/:id',
        element: <Verificate />,
      },
      {
        path: '/games/new',
        element: <NewGame />,
      },
      {
        path: '/games/join',
        element: <JoinGame />,
      },
      {
        path: '/games/play/:gameId',
        element: <Playgame />,
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
)