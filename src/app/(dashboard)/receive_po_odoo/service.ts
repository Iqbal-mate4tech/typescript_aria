import { doGetRequest, doPostRequest, doOdooGetRequest, doOdooPostRequest } from '../../../shared/api/base-api';
import { apiUrl } from '../../../shared/constants';
import { stringformat } from '../../../shared/common';

// Define the types of the expected data (adjust according to actual API responses)
interface PoItem {
  id: number;
  name: string;
  quantity: number;

  // Add more fields as required
}

interface ReceivePOData {
  poId: string;
  items: PoItem[];

  // Add more fields as required
}

export function getpo(poId: string): Promise<any> {
  return doOdooGetRequest(stringformat(apiUrl.getpo, [poId]));
}

export function AddPoItems(data: PoItem[]): Promise<any> {
  return doPostRequest(apiUrl.addPoItems, data);
}

export function updateqty(orderline_id: string | number, qty_to_receive: number): Promise<any> {
  return doOdooPostRequest(stringformat(apiUrl.updateqty, [orderline_id, qty_to_receive]));
}

export function receivePO(data: ReceivePOData): Promise<any> {
  return doPostRequest(apiUrl.receivePOnew, data);
}
