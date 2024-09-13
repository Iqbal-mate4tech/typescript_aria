import { doGetRequest, doPostRequest, doOdooGetRequest } from '../../../shared/api/base-api';
import { apiUrl } from '../../../shared/constants';
import { stringformat } from '../../../shared/common';

export interface PalletItem {
  id: number;
  name: string;

  // Add other properties as necessary
}

export interface PalletData {
  palletId: number;

  // Add other properties as necessary
}

export function getPoid(poid: string): Promise<any> {
  return doGetRequest(stringformat(apiUrl.getPoid, [poid]));
}

export function barcodeScanApi(ITOID: string): Promise<any> {
  return doGetRequest(stringformat(apiUrl.getIto, [ITOID]));
}

export function updateQty(data: any): Promise<any> {
  return doPostRequest(apiUrl.updateQty, data);
}

export function receivePO(data: any): Promise<any> {
  return doPostRequest(apiUrl.receivePO, data);
}

// export function validateStoreId(palletId: number, itoId: number): Promise<any> {
//   return doGetRequest(stringformat(apiUrl.getvalidatestoreid, [palletId, itoId]));
// }

export function palletStatus(): Promise<any> {
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
  let uri = apiUrl.palletStatus;

  if (userType === 'warehouse') {
    uri = apiUrl.palletWarehouseStatus;
  } else if (userType === 'store') {
    uri = apiUrl.palletStoreStatus;
  }

  return doGetRequest(uri);
}

export function palletCategory(): Promise<any> {
  return doGetRequest(apiUrl.palletCategory);
}

export function palletStore(): Promise<any> {
  return doGetRequest(apiUrl.palletStore);
}

export function pallets(data: PalletData): Promise<any> {
  return doPostRequest(apiUrl.pallets, data);
}

export function palletItemsById(id: number): Promise<any> {
  return doGetRequest(stringformat(apiUrl.palletItemsById, [id]));
}

export function palletTypes(): Promise<any> {
  return doGetRequest(apiUrl.palletTypes);
}

export function palletBuilders(): Promise<any> {
  return doGetRequest(apiUrl.palletBuilders);
}

export function savePallet(data: any): Promise<any> {
  return doPostRequest(apiUrl.addPalletAndItems, data);
}

export function updatePallet(data: any): Promise<any> {
  return doPostRequest(apiUrl.addPalletAndItems, data);
}

export function savePalletItem(data: any): Promise<any> {
  return doPostRequest(apiUrl.addPalletItem, data);
}

export function deletePallet(id: number): Promise<any> {
  return doGetRequest(stringformat(apiUrl.deletePallet, [id]));
}

export function deletePalletItem(id: number): Promise<any> {
  return doGetRequest(stringformat(apiUrl.deletePalletItem, [id]));
}

export function updatePalletItem(data: any): Promise<any> {
  return doPostRequest(apiUrl.updatePalletItem, data);
}

export function palletShipper(): Promise<any> {
  return doGetRequest(apiUrl.palletShipper);
}

export function palletByStatus(data: any): Promise<any> {
  return doPostRequest(apiUrl.palletByStatus, data);
}

export function updatePalletShippingStatus(data: any): Promise<any> {
  return doPostRequest(apiUrl.updatePalletShippingStatus, data);
}

export function getItemDescription(data: string): Promise<any> {
  return doOdooGetRequest(stringformat(apiUrl.getDescription, [data]));
}

export function getITODetails(data: any): Promise<any> {
  return doPostRequest(apiUrl.pallets, data);
}

export function syncPrice(): Promise<any> {
  return doPostRequest(apiUrl.syncPrice, {});
}

export function syncPriceStatus(): Promise<any> {
  return doGetRequest(apiUrl.syncPriceStatus);
}
