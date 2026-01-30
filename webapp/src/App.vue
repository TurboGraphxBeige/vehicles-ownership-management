<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const ready = ref(false)
const store = useAuthStore()

onMounted(async () => {
  if (store.restoreSession) {
    await store.restoreSession()
  }
  ready.value = true
})
</script>
