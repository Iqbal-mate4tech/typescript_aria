import { actionTypes } from './action';

// Define the shape of the state
interface FormData {
    palletIds: string[];
}

interface State {
    data: any[]; // Specify correct data type if known
    error: string | null;
    formData: FormData;
    palletStatus?: any; // Define specific type if known
    palletCategory?: any; // Define specific type if known
    palletStore?: any; // Define specific type if known
    pallets?: any; // Define specific type if known
    palletItems?: any[]; // Define specific type if known
    palletBuilders?: any; // Define specific type if known
    palletTypes?: any; // Define specific type if known
    palletShipper?: any; // Define specific type if known
    syncStatus?: any; // Define specific type if known
    barcodeScan?: any[]; // Define specific type if known
    barcodeScanPo?: any[]; // Define specific type if known
    poQuantity?: any; // Define specific type if known
}

// Define action payload types for each action
interface Action {
    type: string;
    payload?: any; // Specify payload type for each action
}

// Initial state
const initialState: State = {
    data: [],
    error: null,
    formData: { palletIds: [] },
};

// Reducer function
export default (state = initialState, action: Action): State => {
    const { type, payload } = action;

    switch (type) {
        case actionTypes.PALLET_STATUS_RECEIVED:
            return {
                ...state,
                palletStatus: payload,
                error: null,
            };

        case actionTypes.PALLET_CATEGORY_RECEIVED:
            return {
                ...state,
                palletCategory: payload,
                error: null,
            };

        case actionTypes.PALLET_STORE_RECEIVED:
            return {
                ...state,
                palletStore: payload,
                error: null,
            };

        case actionTypes.PALLETS_RECEIVED:
            return {
                ...state,
                pallets: payload,
                error: null,
            };

        case actionTypes.PALLET_ITEMS_RECEIVED:
            return {
                ...state,
                palletItems: payload,
            };

        case actionTypes.PALLETS_UNMOUNT:
            return {
                ...initialState,
            };

        case actionTypes.PALLETS_CLEAR:
            return {
                ...state,
                pallets: '',
            };

        case actionTypes.PALLET_BUILDERS_RECEIVED:
            return {
                ...state,
                palletBuilders: payload,
            };

        case actionTypes.PALLET_TYPES_RECEIVED:
            return {
                ...state,
                palletTypes: payload,
            };

        case actionTypes.PALLET_ADD_ITEM_TO_LIST:
            return {
                ...state,
                palletItems: [payload, ...(state.palletItems || [])],
            };

        case actionTypes.PALLET_ADD_UPDATE_UNMOUNT:
            return {
                ...state,
                palletItems: '',
            };

        case actionTypes.PALLET_SHIPPER_RECEIVED:
            return {
                ...state,
                palletShipper: payload,
            };

        case actionTypes.PALLET_FORM_DATA:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    ...payload,
                },
            };

        case actionTypes.CLEAR_PALLET_FORM_DATA:
            return {
                ...state,
                formData: payload,
            };

        case actionTypes.PRICE_SYNC_STATUS:
            return {
                ...state,
                syncStatus: payload,
            };

        case actionTypes.BARCODE_SCAN:
            return {
                ...state,
                barcodeScan: payload,
                error: null,
            };

        case actionTypes.BARCODE_SCAN_PO:
            return {
                ...state,
                barcodeScanPo: payload,
                error: null,
            };

        case actionTypes.VALIDATE_STORE_ID:
            return {
                ...state,
                poQuantity: payload,
                error: null,
            };

        case actionTypes.PALLET_STORE_RECEIVED:
            return {
                ...state,
                palletStore: payload,
                error: null,
            };

        default:
            return state;
    }
};
