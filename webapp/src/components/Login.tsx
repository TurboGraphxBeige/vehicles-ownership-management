import {TextField} from "@mui/material";
import { Box } from "@mui/material";
import apiService from "../services/api.service.ts";
import { useState } from "react";
import { useSelector } from 'react-redux'
import type { AuthState } from "../stores/components.store.ts";
import authStore from "../stores/components.store.ts"
import {Navigate} from 'react-router-dom';


function Login() {

    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const currentUser = useSelector((state: AuthState) => state.currentUser)

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await apiService.doLogin(login, password)
        console.log('res', res.access_token.token)
        if (res.access_token) {
            localStorage.setItem('token', res.access_token.token)
            //localStorage.setItem('refreshToken', res.refresh_token.token)
            authStore.dispatch({
                type: "USER_LOGGED_IN",
                payload: { username: res.access_token.username }
            });
        }
    }

    if (currentUser) {
        return <Navigate to="/home" />;
    }

    return (
        !currentUser ?
        <form onSubmit={handleLogin}>
            <h1>Vehicle Ownership Management System</h1>
            <div style={{ padding: '20px' }}>Login with your user account</div>
            <Box mb={2}>
                <TextField id="login-field" label="Login" variant="outlined" onChange={(e) => setLogin(e.target.value)} />
            </Box>
            <Box mb={2}>
                <TextField id="password-field" type="password" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)}  />
            </Box>
            <button type="submit" > Login </button>
        </form>
        : <Navigate to="/home" />
    )
}

export default Login