import { useState, useEffect } from 'react'

import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login'
import Main from './components/Main'
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import apiService from "./services/api.service.ts";
import authStore from "./stores/components.store.ts";
import {useSelector} from "react-redux";
import type { AuthState } from "./stores/components.store.ts";
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
    const currentUser = useSelector((state: AuthState) => state.currentUser)
    const [initializing, setInitializing] = useState(true); // Step 1: Initializing state
    const token: string | null = localStorage.getItem('token')
    const theme = createTheme();

    useEffect( () => {
        const verifyToken = async () => {
            if (token) {
                const tokenValid: boolean = await apiService.verifyToken(token)

                if (tokenValid === false) {
                    console.log('TOEKEN INVALID')
                    authStore.dispatch({
                        type: 'TOKEN_VERIFIED',
                        payload: {username: ''}
                    })
                }
            }
            setInitializing(false);
        }
        verifyToken()
    }, [token])

    if (initializing) {
       return <div>Loading...</div>
    }

    return (
      <Router>
          <Routes>
              <Route path="/login" element={currentUser ? <Navigate to="/home" /> : <Login />} />
              <Route element={<ProtectedRoutes currentUser={currentUser} />}>
                  <Route path="/home" element={currentUser ? <Main /> : <Navigate to="/login" />} />
              </Route>
              <Route path="/" element={<Login />} />
          </Routes>
      </Router>
    )
}

export default App
