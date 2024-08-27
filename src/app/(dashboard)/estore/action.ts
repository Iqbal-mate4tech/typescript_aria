import { Dispatch } from 'redux';
import { getOnlineOrders, getOnlineOrdersCost } from './service';
import { showLoaderAction, stopLoaderAction } from '../user_master/action';

/**
 * Action types
 */
export const actionTypes = {
  ORDER_RECEIVED: 'ORDER_RECEIVED',
  ORDER_UNMOUNT: 'ORDER_UNMOUNT',
  ORDERS_CLEAR: 'ORDERS_CLEAR',
  ORDER_COST_RECEIVED: 'ORDER_COST_RECEIVED'
};

interface OrderData {
  id: number;
  order_number: string;
  total_price: string;
  processed_at: string;
  order_status_url: string;
}

interface OrdersResponse {
  orders: OrderData[];
}

interface OrderCostResponse {
  total_cost: number;
}

interface OrdersActionData {
  startDate?: string;
  endDate?: string;
  page: number;
}

export const receivedOrdersAction = (payload: OrdersResponse[]) => ({
  type: actionTypes.ORDER_RECEIVED,
  payload
});

export const ordersAction = (data: OrdersActionData) => {
  return async (dispatch: Dispatch, getState: () => any) => {
    if (data.page < 2) {
      dispatch(showLoaderAction('orders'));
    }

    let request = '';

    if (data.startDate) {
      request += `created_at_min=${data.startDate.substring(0, 10)}T00:00:00+10:00&`;
    }

    if (data.endDate) {
      request += `created_at_max=${data.endDate.substring(0, 10)}T23:59:59+10:00&`;
    }

    request += `page=${data.page}&financial_status=paid&fields=id,order_number,total_price,processed_at,order_status_url`;

    try {
      const response = await getOnlineOrders(request);
      if (data.page < 2) {
        dispatch(stopLoaderAction('orders'));
      }

      const parsedResponse = [JSON.parse(response[0]), JSON.parse(response[1])] as OrdersResponse[];

      if (data.page > 1) {
        const state = getState();
        parsedResponse[0].orders = [...state.order.orders[0].orders, ...parsedResponse[0].orders];
      }

      dispatch(receivedOrdersAction(parsedResponse));
      return true;
    } catch (error) {
      if (data.page < 2) {
        dispatch(stopLoaderAction('orders'));
      }
      return false;
    }
  };
};

export const unmountOrderAction = () => ({
  type: actionTypes.ORDER_UNMOUNT
});

export const clearOrderAction = () => ({
  type: actionTypes.ORDERS_CLEAR
});

export const receivedOrdersCostAction = (payload: OrderCostResponse) => ({
  type: actionTypes.ORDER_COST_RECEIVED,
  payload
});

export const ordersCostAction = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await getOnlineOrdersCost();
      dispatch(receivedOrdersCostAction(response));
    } catch (error) {
      // Handle error if needed
    }
  };
};
