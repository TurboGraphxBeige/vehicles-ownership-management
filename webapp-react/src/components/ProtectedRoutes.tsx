import {useState, useEffect, React} from 'react'
import {
    Navigate
} from 'react-router-dom'

import Main from '../components/Main'
import apiService from "../services/api.service"

function ProtectedRoutes({ currentUser }: { currentUser: string | null }) {

    if (currentUser) {
        return <Main  />
    }

    return <Navigate to="/login" />;
}

export default ProtectedRoutes;