

<template>
  <v-row>
    <v-col
      v-for="car in store.vehicles"
      :key="car.car_id"
      cols="12"
      sm="6"
      md="4"
    >
      <v-card
        class="mx-auto"
        max-width="344"
      >
        <v-img
          height="200px"
          :src="car?.images?.[0]?.data || ''"
          cover
        ></v-img>

        <v-card-title>
          {{  car.brand_name }} {{car.model_name }}<br>{{car.making_year}}
        </v-card-title>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text="Open"
            @click="openButtonClick(car)"
          />
        </v-card-actions>

      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-card
        class="mx-auto d-flex align-center justify-center"
        max-width="344"
        height="300"
        outlined
        @click="addNewVehicleAction"
        style="cursor:pointer"
      >
        <v-icon size="64" color="primary">mdi-plus</v-icon>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>

<script setup>
  import { onMounted, ref } from "vue"
  import { apiService } from "@/apiService.js"
  import { useComponentStore } from '@/stores'

  const store = useComponentStore()

  //const cars = ref(store.vehicles)
  //const selectedCarId = ref(null);
  const emit = defineEmits(['openVehicle']);

  const addNewVehicleAction = async () => {
    store.newVehicleDialogIsActive = true
    console.log('newVehicleDialogIsActive', store.newVehicleDialogIsActive)
  }

  const openButtonClick = (vehicle) => {
    console.log('openButtonClick', vehicle)
    //apiService.getCar(car_id)
    emit('openVehicle', vehicle)
  }
</script>
