<template>

  <v-app>

    <AppBar />
    <Login v-if="showLoginDialog" v-model="showLoginDialog" @close="showLoginDialog = false" />
    <v-main v-if="showContent" v-model="showContent">
      <Maison v-if="currentComponent === 'Dashboard'" />
      <Vehicles v-if="currentComponent === 'Vehicles'" />
    </v-main>
  </v-app>
</template>

<script setup>
  import { computed } from 'vue'
  import { useComponentStore } from '@/stores'
  import Dashboard from '@/components/Dashboard.vue'
  import Vehicles from '@/components/Vehicles.vue'
  import Login from '@/components/Login.vue'
  import { ref, onMounted } from 'vue'
  import { apiService } from "@/apiService.js"

  const store = useComponentStore()

  const verifyLocalToken = async () => {
    const token = await localStorage.getItem('token')
    if (token) {
      store.token = token
      console.log('verifytoken', token)
    }
  }

  onMounted(async () => {
    await apiService.verifyToken(localStorage.token)

    if (localStorage.token) {
      store.isUserLoggedIn = true
      store.isLoginActive = false
      store.setCars(apiService)
    }
  })
  const showLoginDialog = computed(() => !store.isUserLoggedIn)

  const showContent = computed(() => store.isUserLoggedIn)
  const currentComponent = computed(() => store.currentComponent)
  // const isLoginActive = computed( () => store.isLoginActive)

</script>
