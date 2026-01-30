/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import { createPinia } from 'pinia';


// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

// Styles
import 'unfonts.css'

const app = createApp(App)

app.use(createPinia()) // Correctly use Pinia as a plugin
registerPlugins(app)
import { useAuthStore} from "@/stores/auth.js";

const auth = useAuthStore()
await auth.restoreSession()



app.mount('#app')
