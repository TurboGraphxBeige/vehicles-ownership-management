import { createStore } from 'redux';


// Define the shape of the state
export interface AuthState {
    currentUser: string;
    cars: string[];
    brands: string[];
    models: string[];
}

// Define the initial state
const initialState: AuthState = { currentUser: '', cars: [], brands: [], models: []};

// Define action types
const USER_LOGGED_IN = 'USER_LOGGED_IN';
const TOKEN_VERIFIED = 'TOKEN_VERIFIED';
const CARS_UPDATED = 'CARS_UPDATED';
const BRANDS_UPDATED = 'BRANDS_UPDATED';
const MODELS_UPDATED = 'MODELS_UPDATED';

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

// Combine action types
type CounterActionTypes = UserLoginAction | TokenVerifiedAction | CarsUpdatedAction | BrandsUpdatedAction | ModelsUpdatedAction;

// Create a reducer function
const counterReducer = (state = initialState, action: CounterActionTypes): AuthState => {
    switch (action.type) {
        case USER_LOGGED_IN:
            return { ...state, currentUser: action.payload.username };
        case TOKEN_VERIFIED:
            return { ...state, currentUser: action.payload.username }
        case CARS_UPDATED:
            return { ...state, cars: action.payload.cars }
        default:
            return state;
    }
};
const enhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__?.()
// Create store
const authStore = createStore(counterReducer, enhancer);

export default authStore;