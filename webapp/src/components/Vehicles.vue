<template>
  <v-app>
      <v-container>
        <h1>Vehicles</h1>
      <CarCard  @open-vehicle="(vehicle) => (selectedVehicle = vehicle, vehicleDialogIsActive = true)" />
        <NewCar v-model="newVehicleDialogIsActive" />
        <Car @close-vehicle-dialog="() => {vehicleDialogIsActive = false}" v-model="vehicleDialogIsActive" :car="selectedVehicle" />
      </v-container>
  </v-app>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { apiService } from '@/apiService.js'
  import Car from '@/components/Car.vue'
  import CarCard from '@/components/CarCard.vue'
  import NewCar from '@/components/NewCar.vue'
  import { useComponentStore } from '@/stores'

  const store = useComponentStore()
  const newVehicleDialogIsActive = computed(() => store.newVehicleDialogIsActive)
  //const vehicleDialogIsActive = computed(() => store.vehicleDialogIsActive)
  const vehicleDialogIsActive = ref(null)
  const selectedVehicle = ref(null)

  onMounted(async () => {
    await store.setCars(apiService)
  })

  onMounted(async () => {
    await store.setBrands(apiService)
  })

</script>

<style scoped>

</style>
