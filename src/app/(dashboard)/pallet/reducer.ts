import { actionTypes } from './action';

// Define the types for your state
interface PalletState {
    data: any[]; // Update this with the actual data structure you are using
    error: string | null;
    palletStatus?: any; // Update with the actual type
    palletCategory?: any; // Update with the actual type
    palletStore?: any; // Update with the actual type
    pallets?: any; // Update with the actual type
    palletItems?: any[]; // Update with the actual type
    palletBuilders?: any; // Update with the actual type
    palletTypes?: any; // Update with the actual type
    palletShipper?: any; // Update with the actual type
    formData: {
        palletIds: any[]; // Update with the actual type
        [key: string]: any; // This allows dynamic fields to be added to formData
    };
    syncStatus?: boolean;
}

// Define the initial state with proper types
const initialState: PalletState = {
    data: [],
    error: null,
    formData: { palletIds: [] },
};

// Define the type of action object
interface Action {
    type: string;
    payload?: any; // This should be updated to match the specific payloads for each action type
}

/** Reducers */
export default function palletReducer(state = initialState, action: Action): PalletState {
    const { type, payload } = action;

    switch (type) {
        case actionTypes.PALLET_STATUS_RECEIVED:
            return {
                ...state,
                palletStatus: payload,
                error: null
            };

        case actionTypes.PALLET_CATEGORY_RECEIVED:
            return {
                ...state,
                palletCategory: payload,
                error: null
            };

        case actionTypes.PALLET_STORE_RECEIVED:
            return {
                ...state,
                palletStore: payload,
                error: null
            };

        case actionTypes.PALLETS_RECEIVED:
            return {
                ...state,
                pallets: payload,
                error: null
            };

        case actionTypes.PALLET_ITEMS_RECEIVED:
            return {
                ...state,
                palletItems: payload
            };

        case actionTypes.PALLETS_UNMOUNT:
            return {
                ...initialState
            };

        case actionTypes.PALLETS_CLEAR:
            return {
                ...state,
                pallets: ''
            };

        case actionTypes.PALLET_BUILDERS_RECEIVED:
            return {
                ...state,
                palletBuilders: payload
            };

        case actionTypes.PALLET_TYPES_RECEIVED:
            return {
                ...state,
                palletTypes: payload
            };

        case actionTypes.PALLET_ADD_ITEM_TO_LIST:
            return {
                ...state,
                palletItems: [payload, ...(state.palletItems || [])]
            };

        case actionTypes.PALLET_ADD_UPDATE_UNMOUNT:
            return {
                ...state,
                palletItems: ''
            };

        case actionTypes.PALLET_SHIPPER_RECEIVED:
            return {
                ...state,
                palletShipper: payload
            };

        case actionTypes.PALLET_FORM_DATA:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    ...payload
                }
            };

        case actionTypes.CLEAR_PALLET_FORM_DATA:
            return {
                ...state,
                formData: payload
            };

        case actionTypes.PRICE_SYNC_STATUS:
            return {
                ...state,
                syncStatus: payload
            };

        default:
            return state;
    }
}
