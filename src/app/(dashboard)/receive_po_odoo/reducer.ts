import { actionTypes } from './action';

// Define the structure of the state's initial state
interface InitialState {
    data: any[];
    error: string | null;
    formData: {
        palletIds: string[];
    };
    palletStatus?: any;
    palletCategory?: any;
    palletStore?: any;
    pallets?: any;
    palletItems?: any;
    palletBuilders?: any;
    palletTypes?: any;
    palletShipper?: any;
    syncStatus?: any;
    barcodeScan?: any;
    poOdooQuantity?: any;
    poQuantity?: any;
}

// Initial state
const initialState: InitialState = {
    data: [],
    error: null,
    formData: { palletIds: [] },
};

// Define Action type
interface Action {
    type: string;
    payload?: any;
}

// Reducer function
const reducer = (state: InitialState = initialState, action: Action): InitialState => {
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

        case actionTypes.PO_QUANTIY_RECEIVED_ODOO:
            return {
                ...state,
                poOdooQuantity: payload,
                error: null,
            };

        case actionTypes.VALIDATE_STORE_ID:
            return {
                ...state,
                poQuantity: payload,
                error: null,
            };

        default:
            return state;
    }
};

export default reducer;
