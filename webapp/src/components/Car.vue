<template>
  <v-dialog v-model="localDialog" max-width="900px" persistent>
    <v-card>
      <v-toolbar dense flat color="primary">
        <v-toolbar-title class="white--text">
          {{ isNew ? 'New Car' : 'Edit Car' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="onCancel" class="white--text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" lazy-validation v-model="formValid">
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  :items="modelOptions"
                  item-text="label"
                  item-value="model_id"
                  label="Model"
                  v-model="editedCar.model_id"
                  :rules="[v => !!v || 'Model is required']"
                  return-object="false"
                  dense
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  :items="brandOptions"
                  item-text="label"
                  item-value="brand_id"
                  label="Brand"
                  v-model="editedCar.brand_id"
                  :rules="[v => !!v || 'Brand is required']"
                  dense
                ></v-select>
              </v-col>

              <v-col cols="6" md="3">
                <v-text-field
                  label="Making Year"
                  v-model="editedCar.making_year"
                  type="number"
                  :rules="[v => !v || (v >= 1886 && v <= 2100) || 'Enter a valid year']"
                  dense
                />
              </v-col>

              <v-col cols="6" md="3">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedCar.purchase_date"
                      label="Purchase Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                    />
                  </template>
                  <v-date-picker v-model="editedCar.purchase_date" @input="menu = false" />
                </v-menu>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  :items="sellerOptions"
                  item-text="label"
                  item-value="seller_id"
                  v-model="editedCar.seller_id"
                  label="Seller"
                  dense
                  clearable
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  :items="userOptions"
                  item-text="label"
                  item-value="user_id"
                  v-model="editedCar.user_id"
                  label="Owner (User)"
                  dense
                  clearable
                />
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <!-- Services section -->
            <v-row>
              <v-col cols="12">
                <div class="d-flex align-center justify-space-between mb-2">
                  <h3 class="subtitle-1">Services</h3>
                  <v-btn small color="primary" @click="addService">Add Service</v-btn>
                </div>

                <v-expansion-panels multiple>
                  <v-expansion-panel
                    v-for="(service, sIdx) in editedCar.services"
                    :key="service.service_id || sIdx"
                  >
                    <v-expansion-panel-header>
                      <div>
                        <strong>{{ service.service_date ? service.service_date : 'New service' }}</strong>
                        <div class="grey--text text--darken-1">{{ service.garage_name }}</div>
                      </div>
                      <v-spacer></v-spacer>
                      <v-btn icon small color="error" @click.stop="removeService(sIdx)">
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            label="Service Date"
                            v-model="service.service_date"
                            dense
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="Garage" v-model="service.garage_name" dense />
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            label="Service Request Description"
                            v-model="service.service_request_description"
                            dense
                          />
                        </v-col>
                      </v-row>

                      <!-- Maintenance tasks -->
                      <v-subheader class="mt-2">Maintenance Tasks</v-subheader>
                      <v-simple-table dense>
                        <thead>
                        <tr>
                          <th class="text-left">Description</th>
                          <th class="text-left">Type</th>
                          <th class="text-left">Cost</th>
                          <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(mt, mtIdx) in service.maintenance_tasks" :key="mt.maintenance_task_id || mtIdx">
                          <td>
                            <v-text-field v-model="mt.description" dense hide-details></v-text-field>
                          </td>
                          <td style="width:200px;">
                            <v-select
                              :items="maintenanceTypeOptions"
                              v-model="mt.maintenance_task_type"
                              dense
                              hide-details
                            />
                          </td>
                          <td style="width:120px;">
                            <v-text-field v-model="mt.cost" type="number" dense hide-details />
                          </td>
                          <td style="width:56px;">
                            <v-btn icon small color="error" @click="removeMaintenanceTask(sIdx, mtIdx)">
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                        </tbody>
                      </v-simple-table>
                      <div class="mt-2">
                        <v-btn small color="primary" @click="addMaintenanceTask(sIdx)">Add Task</v-btn>
                      </div>

                      <v-divider class="my-3"></v-divider>

                      <!-- Service recommendations -->
                      <v-subheader>Recommendations</v-subheader>
                      <v-simple-table dense>
                        <thead>
                        <tr>
                          <th class="text-left">Description</th>
                          <th class="text-left">Est. Cost</th>
                          <th class="text-left">Priority</th>
                          <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(rec, rIdx) in service.recommendations" :key="rec.service_recommendation_id || rIdx">
                          <td>
                            <v-text-field v-model="rec.description" dense hide-details />
                          </td>
                          <td style="width:120px;">
                            <v-text-field v-model="rec.estimated_cost" type="number" dense hide-details />
                          </td>
                          <td style="width:120px;">
                            <v-select :items="[0,1,2,3,4,5]" v-model="rec.priority" dense hide-details />
                          </td>
                          <td style="width:56px;">
                            <v-btn icon small color="error" @click="removeRecommendation(sIdx, rIdx)">
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                        </tbody>
                      </v-simple-table>
                      <div class="mt-2">
                        <v-btn small color="primary" @click="addRecommendation(sIdx)">Add Recommendation</v-btn>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn text color="red" @click="deleteVehicleAction">Delete Vehicle</v-btn>
        <v-spacer></v-spacer>
        <v-btn text color="grey" @click="onCancel">Cancel</v-btn>
        <v-btn color="primary" :loading="saving" :disabled="!formValid" @click="onSave">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref, reactive, computed, watch, onMounted } from 'vue';
  import axios from 'axios';
  import {apiService} from "@/apiService.js";
  import {useComponentStore} from "@/stores/index.js"

  const store = useComponentStore()

  const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

  // Props: support both Vue 3 v-model (modelValue) and legacy "value" prop for compatibility
  const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  value: { type: Boolean, default: false }, // legacy
  carId: { type: String, default: null },
  car: { type: String, default: null }
});

  // Emits: keep update:modelValue for v-model, also emit "input" for compatibility and saved/canceled
  const emit = defineEmits(['update:modelValue', 'input', 'saved', 'canceled', 'close-vehicle-dialog'])

  // local dialog state (prefer modelValue if provided, else fallback to value)
  const localDialog = ref(props.modelValue !== undefined ? props.modelValue : props.value);

  // form ref
  const formRef = ref(null);

  // Reactive state
  const originalCar = ref(null);
  const editedCar = ref(emptyCar());
  const formValid = ref(true);
  const menu = ref(false);
  const saving = ref(false);

  const maintenanceTypeOptions = ref(['repair', 'replace', 'clean', 'inspect', 'adjust', 'lubricate']);

  // select options
  const modelOptions = ref([]);
  const brandOptions = ref([]);
  const sellerOptions = ref([]);
  const userOptions = ref([]);

  // Computed
  const isNew = computed(() => !editedCar.value || !editedCar.value.car_id);

  // Keep localDialog in sync with incoming props
  watch(
  () => props.modelValue,
  (v) => {
  if (v !== undefined) localDialog.value = v;
}
  );
  watch(
  () => props.value,
  (v) => {
  // only update from legacy value if modelValue is not being used
  if (props.modelValue === undefined) localDialog.value = v;
}
  );

  // When localDialog changes, emit events and run open/reset logic
  watch(localDialog, (v) => {
  // emit both for compatibility
  emit('update:modelValue', v);
  emit('input', v);

  if (v) opened();
  else reset();
});

  // Watch incoming car prop (object) and carId
  watch(
  () => props.car,
  (newCar) => {
  if (newCar) loadFromProp(newCar);
}
  );

  watch(
  () => props.car,
  (newId) => {
  if (newId && localDialog.value) loadCar(newId);
}
  );

  // Lifecycle (created replacement)
  onMounted(() => {
    console.log('CAR PROPS', props)
    // if dialog already open on mount, load initial data
    if (props.car && localDialog.value) loadFromProp(props.car)
    if (props.carId && localDialog.value) loadCar(props.carId)
  })

  const deleteVehicleAction = async () => {
    const res = await apiService.deleteVehicle(props.car.vehicle_id)

    if (res.status === 200) {
      store.deleteVehicleById(props.car.vehicle_id)
      emit('close-vehicle-dialog')
    }
  }

  // Helpers / methods
  function emptyCar() {
  return {
  car_id: null,
  model_id: null,
  brand_id: null,
  making_year: null,
  purchase_date: null,
  seller_id: null,
  user_id: null,
  services: []
};
}


  async function loadCar(car) {
    console.log("BLEHHH", car)
    if (!car) return;
  try {
    console.log('carcar', car)

} catch (err) {
  console.error('Failed to load car', err);
}
}

  function loadFromProp(carObj) {

    console.log('carObj', carObj);
  // deep clone to allow editing without mutating parent
  originalCar.value = JSON.parse(JSON.stringify(carObj));

  const safeServices = (carObj.services || []).map((s) => ({
  service_id: s.service_id || null,
  service_date: s.service_date || null,
  service_request_description: s.service_request_description || null,
  garage_name: s.garage_name || null,
  total_cost: s.total_cost || 0,
  notes: s.notes || null,
  recommendations: (s.recommendations || []).map((r) => ({
  service_recommendation_id: r.service_recommendation_id || null,
  service_date: r.service_date || null,
  description: r.description || '',
  estimated_cost: r.estimated_cost || 0,
  priority: r.priority || 0,
  status: r.status || 'recommended'
})),
  maintenance_tasks: (s.maintenance_tasks || []).map((mt) => ({
  maintenance_task_id: mt.maintenance_task_id || null,
  description: mt.description || '',
  cost: mt.cost || 0,
  notes: mt.notes || '',
  maintenance_task_type: mt.maintenance_task_type || 'repair'
}))
}));

  // Replace editedCar.value with a fresh object (refs are unwrapped in template)
  editedCar.value = {
  car_id: carObj.car_id || null,
  model_id: carObj.model_id || null,
  brand_id: carObj.brand_id || null,
  making_year: carObj.making_year || null,
  purchase_date: carObj.purchase_date || null,
  seller_id: carObj.seller_id || null,
  user_id: carObj.user_id || null,
  services: safeServices
};
}

  function opened() {
  if (props.car) {
  loadFromProp(props.car);
} else if (props.carId) {
  loadCar(props.car);
} else {
  editedCar.value = emptyCar();
}
}

  function reset() {
  editedCar.value = emptyCar();
  originalCar.value = null;
  formValid.value = true;
  saving.value = false;
}

  function onCancel() {
  localDialog.value = false;
  emit('canceled');
}

  async function onSave() {
  // validate form (if you use v-form)
  const valid = formRef.value ? await formRef.value.validate() : true;
  if (!valid) return;

  saving.value = true;
  try {
  if (editedCar.value.car_id) {
  const res = await axios.put(
  `${API_URL}/cars/${encodeURIComponent(editedCar.value.car_id)}`,
  editedCar.value
  );
  emit('saved', res.data);
} else {
  const res = await axios.post(`${API_URL}/cars`, editedCar.value);
  emit('saved', res.data);
}
  localDialog.value = false;
} catch (err) {
  console.error('Failed to save car', err);
} finally {
  saving.value = false;
}
}

  // Service manipulations
  function addService() {
  editedCar.value.services.unshift({
    service_id: null,
    service_date: null,
    service_request_description: '',
    garage_name: '',
    total_cost: 0,
    notes: '',
    recommendations: [],
    maintenance_tasks: []
  });
}
  function removeService(index) {
  editedCar.value.services.splice(index, 1);
}

  // Maintenance tasks
  function addMaintenanceTask(serviceIdx) {
  editedCar.value.services[serviceIdx].maintenance_tasks.push({
    maintenance_task_id: null,
    description: '',
    cost: 0,
    notes: '',
    maintenance_task_type: 'repair'
  });
}
  function removeMaintenanceTask(serviceIdx, taskIdx) {
  editedCar.value.services[serviceIdx].maintenance_tasks.splice(taskIdx, 1);
}

  // Recommendations
  function addRecommendation(serviceIdx) {
  editedCar.value.services[serviceIdx].recommendations.push({
    service_recommendation_id: null,
    service_date: null,
    description: '',
    estimated_cost: 0,
    priority: 0,
    status: 'recommended'
  });
}
  function removeRecommendation(serviceIdx, recIdx) {
  editedCar.value.services[serviceIdx].recommendations.splice(recIdx, 1);
}

  // Expose to template (script-setup automatically exposes top-level bindings)
</script>

<style scoped>
/* small adjustments to make tables denser inside dialogs */
.v-simple-table td,
.v-simple-table th {
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>
