// src/containers/purchase-order/service.ts
import { doGetRequest, doPostRequest } from '../../../shared/api/base-api'; // Adjust the path as needed
import { apiUrl } from '../../../shared/constants';
import { stringformat } from '../../../shared/common';

// // Define types for request data and response types as needed
// interface POItemsData {

//   // Define the structure of data that the `poItems` function expects
// }

// interface POStatusResponse {

//   // Define the structure of the response from the poStatus function
// }

// interface POQuantityResponse {

//   // Define the structure of the response from the poQuantity function
// }

// interface ReceivePOData {
//   POID: string;
//   SupplierSku: string;
//   QuantityReceived: number;
//   Comment: string;
//   Variance: number;
//   ReceivedBy: string;
// }

// interface UploadPOData {
//   POID: string;
// }

export function poItems(data: any): Promise<any> {
  return doPostRequest(apiUrl.getPO, data);
}

export function poItemsById(id: any): Promise<any> {
  return doGetRequest(stringformat(apiUrl.poItemsById, [id]));
}

export function poStatus(): Promise<any> {
  return doGetRequest(apiUrl.getPOStatus);
}

export function poQuantity(poId: string, supplierSku: string): Promise<any> {
  return doGetRequest(stringformat(apiUrl.getPOItemQuantity, [poId, supplierSku]));
}

export function receivePO(data: any): Promise<any> {
  return doPostRequest(apiUrl.receivePO, data);
}

export function uploadPO(data: any): Promise<any> {
  return doPostRequest(apiUrl.uploadPO, data);
}

export function poStatusAndItemCount(poId: any): Promise<any> {
  return doGetRequest(stringformat(apiUrl.getPOStatusAndItemCount, [poId]));
}
