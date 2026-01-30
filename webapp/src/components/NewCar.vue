<template>
  <v-dialog v-model="newCar" max-width="500">
    <v-card>
      <v-toolbar dense flat title="New Vehicle" density="compact" color="primary">

        <v-spacer></v-spacer>
        <v-btn icon @click="store.newVehicleDialogIsActive = false" class="white--text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-select
            clearable
            v-model="selectedBrandId"
            :items="store.brands"
            item-value="brand_id"
            item-title="brand_name"
            hint="Brand"
            persistent-hint
            dense
          />
          <v-select
            clearable
            v-model="selectedModelId"
            :items="modelItems"
            item-value="model_id"
            item-title="model_name"
            hint="Model"
            persistent-hint
            :disabled="!selectedBrandId"
          />

          <v-text-field
            persistent-hint
            v-model="making_year"
            hint="Making year"
            :rules="[digitsOnlyRule]"
            maxlength="4"
          />

          <!-- Date picker activator + popup -->
          <v-menu v-model="dateMenu" close-on-content-click="false" max-width="320">
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                label="Purchase date"
                v-model="purchase_date"
                readonly
                @click="dateMenu = true"
                clearable
                @click:clear="modelDate = null"
              />
            </template>

            <v-card>
              <v-date-picker
                v-model="modelDate"
                :show-current="false"
                @update:modelValue="(val) => { modelDate = val }"
              />
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="dateMenu = false">Cancel</v-btn>
                <v-btn text @click="dateMenu = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-file-upload v-model="fileInput" density="compact" variant="compact" title="Choose a thumbnail image">asdasd</v-file-upload>

          <v-card-actions>
            <v-spacer />

            <v-btn text @click="store.newVehicleDialogIsActive = false">Cancel</v-btn>
            <v-btn color="primary" text="Create" @click="addNewCar" />
          </v-card-actions>
        </v-form>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { VFileUpload } from 'vuetify/labs/VFileUpload'
  import { useComponentStore } from '@/stores'
  import {watch, ref, computed} from "vue";

  const store = useComponentStore()

  const newVehicleIsActive = computed(() => store.newVehicleIsActive)

  import { useField, useForm } from 'vee-validate'
  import {apiService} from "@/apiService.js";

  const selectedBrandId = ref(null)
  const selectedModelId = ref(null)
  const making_year = ref(null)
  const purchase_date = ref(null)
  const fileInput = ref(null);



  const modelItems = computed(() => {
    const brand = store.brands.find(b => b.brand_id === selectedBrandId.value)
    return brand ? brand.models : []
  })


  // date picker state
  const dateMenu = ref(false)
  const modelDate = ref(null) // ISO 'YYYY-MM-DD'
  const displayDate = ref('')

  watch(fileInput, v => {
    console.log("fikleinput 000sdsdsdsd", fileInput)
  })




  watch(modelDate, v => {
    displayDate.value = v ? new Date(v).toLocaleDateString() : ''
  })
  const digitsOnlyRule = v => (/^\d*$/).test(v) || 'Only digits allowed'

  const addNewCar = async () => {
    const fd = new FormData()
    fd.append('brand_id', selectedBrandId.value)
    fd.append('model_id', selectedModelId.value)
    fd.append('making_year', making_year.value)
    fd.append('purchase_date', displayDate.value)
    fd.append('file', fileInput.value)

    const res = await apiService.newCar(fd)

    if (res.status === 201) {
      store.setCars(apiService)
      store.newVehicleDialogIsActive = false
      console.log(res)
    }
  }

</script>

<style scoped>

</style>
