import {TextField} from "@mui/material";
import { Box } from "@mui/material";
import apiService from "../services/api.service.ts";
import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import type { AuthState } from "../stores/components.store.ts";
import authStore from "../stores/components.store.ts"
import {Navigate, useNavigate} from 'react-router-dom';
import Main from "./Main.tsx";

function Login() {

    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const currentUser = useSelector((state: AuthState) => state.currentUser)
    const dispatch = useDispatch()
    const count = useSelector((state: AuthState) => state.count)

    const token = localStorage.getItem('token')

    const navigate = useNavigate();



    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(login, password);
        const res = await apiService.doLogin(login, password)
        console.log('res', res)
        if (res.token) {
            console.log('sdfdfgdfgdfg', res.username)
            localStorage.setItem('token', res.token)
            authStore.dispatch({
                type: "USER_LOGGED_IN",
                payload: { username: res.username }
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