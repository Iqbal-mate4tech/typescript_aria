import { doGetRequest, doPostRequest, doPutRequest } from '../../../shared/api/base-api';
import { apiUrl } from '../../../shared/constants';

// Fetch the list of products
export function getProducts(data: object): Promise<any> {
    return doPostRequest(apiUrl.products, data);
}

// Fetch the list of product types
export function getProductType(): Promise<any> {
    return doGetRequest(apiUrl.productType);
}

// Update product information
export function updateProduct(data: object): Promise<any> {
    return doPutRequest(apiUrl.updateProduct, data);
}

// Update product description
export function updateProductDescription(data: object): Promise<any> {
    return doPutRequest(apiUrl.updateProductDescription, data);
}

// Synchronize product data
export function syncProducts(data: object): Promise<any> {
    return doPutRequest(apiUrl.syncProducts, data);
}
