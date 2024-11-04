import { actionTypes } from './action';

/** Action Types */
// interface OrderReceivedAction {
//   type: typeof actionTypes.ORDER_RECEIVED;
//   payload: any; // Define the appropriate type for payload if known
// }

// interface OrderUnmountAction {
//   type: typeof actionTypes.ORDER_UNMOUNT;
//   payload: any;
// }

// interface OrdersClearAction {
//   type: typeof actionTypes.ORDERS_CLEAR;
//   payload: any;
// }

// interface OrderCostReceivedAction {
//   type: typeof actionTypes.ORDER_COST_RECEIVED;
//   payload: any; // Define the appropriate type for payload if known
// }

// type OrderActionTypes =
//   | OrderReceivedAction
//   | OrderUnmountAction
//   | OrdersClearAction
//   | OrderCostReceivedAction;

/** Initial State Type */
interface OrderState {
  data: any[];
  error: string | null;
  formData: any;
  orders?: any[];
  ordersCost?: any;
}

/** Initial state */
const initialState: OrderState = {
  data: [],
  error: null,
  formData: {},
};

/** Reducers */
export default (state = initialState, action: any): OrderState => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.ORDER_RECEIVED:
      return {
        ...state,
        orders: payload,
        error: null,
      };

    case actionTypes.ORDER_UNMOUNT:
      return {
        ...initialState,
      };

    case actionTypes.ORDERS_CLEAR:
      return {
        ...state,
        orders: [],
      };

    case actionTypes.ORDER_COST_RECEIVED:
      return {
        ...state,
        ordersCost: payload,
      };

    default:
      return state;
  }
};
