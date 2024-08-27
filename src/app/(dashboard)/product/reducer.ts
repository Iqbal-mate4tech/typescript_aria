import { actionTypes } from './action';

/** Initial state */
const initialState = {
    data: [],
    error: null,
    formData: {},
    products: null,
    productTypes: null,
    pageData: []
};

/** Reducers */
export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {

        case actionTypes.PRODUCT_RECEIVED:
            return {
                ...state,
                products: payload,
                error: null
            };

        case actionTypes.PRODUCT_UNMOUNT:
            return {
                ...initialState
            };

        case actionTypes.PRODUCT_CLEAR:
            return {
                ...state,
                products: null,
                pageData: []
            };

        case actionTypes.PRODUCT_TYPE_RECEIVED:
            return {
                ...state,
                productTypes: payload
            };

        case actionTypes.PRODUCT_UPDATE_FORM_DATA:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    ...payload
                }
            };

        case actionTypes.PRODUCT_CLEAR_FORM_DATA:
            return {
                ...state,
                formData: {}
            };

        case actionTypes.PRODUCT_UPDATE_PAGE_DATA:
            return {
                ...state,
                pageData: payload
            };

        default:
            return state;
    }
};
