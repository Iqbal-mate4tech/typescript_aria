import { doGetRequest, doPostRequest } from '../../../shared/api/base-api';
import { apiUrl } from '../../../shared/constants';
import { stringformat } from '../../../shared/common';

// Define the types for the request data and response
interface PoItemData {
  poId: any;
  items: any[];
  // Add more fields based on your API's expected data structure
}

interface ReceivePoData {
  poId: any;
  items: any[];
  receivedBy: string;
  // Add more fields based on your API's expected data structure
}

export function getPoid(poid: string | number): Promise<any> {
  const url = stringformat(apiUrl.getPoid, [poid]);
  return doGetRequest(url);
}

export function addPoItems(data: PoItemData): Promise<any> {
  return doPostRequest(apiUrl.addPoItems, data);
}

export function receivePO(data: ReceivePoData): Promise<any> {
  return doPostRequest(apiUrl.receivePOnew, data);
}
