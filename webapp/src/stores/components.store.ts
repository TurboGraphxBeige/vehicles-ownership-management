import { createStore } from 'redux';
import type { Observation} from "../types/Observation.ts";
import type { Maintenance } from "../types/Maintenance.ts";

// Define the shape of the state
export interface AuthState {
    currentUser: string;
    cars: string[];
    brands: string[];
    models: string[];
    selectedObservation: object;
    selectedMaintenance: object;
}

// Define the initial state
const initialState: AuthState = { currentUser: '', cars: [], brands: [], models: [], selectedObservation: {}, selectedMaintenance: {}};

// Define action types
const USER_LOGGED_IN = 'USER_LOGGED_IN';
const TOKEN_VERIFIED = 'TOKEN_VERIFIED';
const CARS_UPDATED = 'CARS_UPDATED';
const BRANDS_UPDATED = 'BRANDS_UPDATED';
const MODELS_UPDATED = 'MODELS_UPDATED';
const SELECTED_OBSERVATION_UPDATED = 'SELECTED_OBSERVATION_UPDATED';
const SELECTED_MAINTENANCE_UPDATED = 'SELECTED_MAINTENANCE_UPDATED';

// Define action interfaces
interface UserLoginAction {
    type: typeof USER_LOGGED_IN;
    payload: {
        username: string;
    }
}

interface TokenVerifiedAction {
    type: typeof TOKEN_VERIFIED;
    payload: {
        username: string;
    }
}

interface CarsUpdatedAction {
    type: typeof CARS_UPDATED;
    payload: {
        cars: string[];
    }
}

interface BrandsUpdatedAction {
    type: typeof BRANDS_UPDATED;
    payload: {
        cars: string[];
    }
}

interface ModelsUpdatedAction {
    type: typeof MODELS_UPDATED;
    payload: {
        cars: string[];
    }
}

interface SelectedObservationsUpdatedAction {
    type: typeof SELECTED_OBSERVATION_UPDATED;
    payload: {
        selectedObservation: Observation | Partial<Observation>;
    }
}

interface SelectedMaintenanceUpdatedAction {
    type: typeof SELECTED_MAINTENANCE_UPDATED;
    payload: {
        selectedMaintenance: Maintenance | Partial<Maintenance>;
    }
}

// Combine action types
type CounterActionTypes = UserLoginAction | TokenVerifiedAction | CarsUpdatedAction | BrandsUpdatedAction | ModelsUpdatedAction | SelectedObservationsUpdatedAction | SelectedMaintenanceUpdatedAction;

// Create a reducer function
const counterReducer = (state = initialState, action: CounterActionTypes): AuthState => {
    switch (action.type) {
        case USER_LOGGED_IN:
            return { ...state, currentUser: action.payload.username };
        case TOKEN_VERIFIED:
            return { ...state, currentUser: action.payload.username }
        case CARS_UPDATED:
            return { ...state, cars: action.payload.cars }
        case SELECTED_OBSERVATION_UPDATED:
            return { ...state, selectedObservation: action.payload.selectedObservation }
        case SELECTED_MAINTENANCE_UPDATED:
            return { ...state, selectedMaintenance: action.payload.selectedMaintenance }
        default:
            return state;
    }
};
const enhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__?.()
// Create store
const authStore = createStore(counterReducer, enhancer);

export default authStore;
export type RootState = AuthState; // or ReturnType<typeof authStore.getState>
