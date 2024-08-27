import { doGetRequest } from '../../../shared/api/base-api';
import { apiUrl } from '../../../shared/constants';

// Define the type for the data parameter
type GetOnlineOrdersParams = string; // This can be adjusted if you have a specific structure for the query parameters

// Fetches online orders based on the provided query string
export function getOnlineOrders(data: GetOnlineOrdersParams): Promise<any> {
  return doGetRequest(`${apiUrl.onlineOrders}?${data}`);
}

// Fetches the cost of online orders
export function getOnlineOrdersCost(): Promise<any> {
  return doGetRequest(apiUrl.onlineOrdersCost);
}

