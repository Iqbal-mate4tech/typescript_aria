import { doGetRequest, doPostRequest, doOdooGetRequest, doOdooPostRequest } from '../../../shared/api/base-api';
import { apiUrl } from '../../../shared/constants';
import { stringformat } from '../../../shared/common';

export function palletStatus(): Promise<any> {
    const userType = localStorage.getItem('userType');
    let uri;

    if (userType === 'warehouse')
        uri = apiUrl.palletWarehouseStatus;
    else if (userType === 'store')
        uri = apiUrl.palletStoreStatus;
    else
        uri = apiUrl.palletStatus;

    return doGetRequest(uri);
}

export function palletCategory(): Promise<any> {
    return doGetRequest(apiUrl.palletCategory);
}

export function palletStore(): Promise<any> {
    return doGetRequest(apiUrl.palletStore);
}

export function pallets(data: any): Promise<any> {
    return doPostRequest(apiUrl.pallets, data);
}

export function palletItemsById(id: string | number): Promise<any> {
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

export function deletePallet(id: string | number): Promise<any> {
    return doGetRequest(stringformat(apiUrl.deletePallet, [id]));
}

export function deletePalletItem(id: string | number): Promise<any> {
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

export function getItemDescription(data: string | number): Promise<any> {
    return doOdooGetRequest(stringformat(apiUrl.getDescription, [data]));
}

export function getProdcutQuanityDetails(data: string | number): Promise<any> {
    return doOdooGetRequest(stringformat(apiUrl.getProductQuantityDetails, [data]));
}

export function updateOdooPalletData(data: any): Promise<any> {
    return doOdooPostRequest(apiUrl.updatePalletOdoo, data);
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
