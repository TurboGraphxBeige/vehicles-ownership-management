import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import authStore from './stores/components.store.ts';

createRoot(document.getElementById('root')!).render(
        <Provider store={authStore}>
            <App />
        </Provider>
)
