// src/containers/purchase-order/reducer.ts
import { actionTypes, POActionPayload } from './action';

/** Initial state */
interface PurchaseOrderState {
  po?: any; // Replace 'any' with the specific type of your 'po' data
  poItems?: any; // Replace 'any' with the specific type of your 'poItems' data
  poStatus?: any; // Replace 'any' with the specific type of your 'poStatus' data
  poStore?: any; // Replace 'any' with the specific type of your 'poStore' data
  poQuantity?: any; // Replace 'any' with the specific type of your 'poQuantity' data
  error?: string | null;
}

const initialState: PurchaseOrderState = {
  error: null,
};

/** Reducer */
export default (state = initialState, action: { type: string; payload: POActionPayload }): PurchaseOrderState => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.PO_RECEIVED:
      return {
        ...state,
        po: payload,
        error: null,
      };

    case actionTypes.PO_ITEMS_RECEIVED:
      return {
        ...state,
        poItems: payload,
      };

    case actionTypes.PO_UNMOUNT:
      return {
        ...initialState,
      };

    case actionTypes.PO_CLEAR:
      return {
        ...state,
        po: '',
      };

    case actionTypes.PO_STATUS_RECEIVED:
      return {
        ...state,
        poStatus: payload,
        error: null,
      };

    case actionTypes.PO_STORE_RECEIVED:
      return {
        ...state,
        poStore: payload,
        error: null,
      };

    case actionTypes.PO_QUANTITY_RECEIVED:
      return {
        ...state,
        poQuantity: payload,
        error: null,
      };

    default:
      return state;
  }
};
