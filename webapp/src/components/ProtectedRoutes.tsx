
import {
    Navigate
} from 'react-router-dom'

import Main from '../components/Main'

function ProtectedRoutes({ currentUser }: { currentUser: string | null }) {

    if (currentUser) {
        return <Main  />
    }

    return <Navigate to="/login" />;
}

export default ProtectedRoutes;