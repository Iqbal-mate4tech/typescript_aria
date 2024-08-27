import { 
    getProducts, 
    getProductType, 
    updateProduct, 
    updateProductDescription, 
    syncProducts 
} from './service';
import { showLoaderAction, stopLoaderAction } from '../user_master/action';

/**
 * Action types
 */
export const actionTypes = {
    PRODUCT_RECEIVED: 'PRODUCT_RECEIVED',
    PRODUCT_UNMOUNT: 'PRODUCT_UNMOUNT',
    PRODUCT_CLEAR: 'PRODUCT_CLEAR',
    PRODUCT_TYPE_RECEIVED: 'PRODUCT_TYPE_RECEIVED',
    PRODUCT_UPDATE_FORM_DATA: 'PRODUCT_UPDATE_FORM_DATA',
    PRODUCT_CLEAR_FORM_DATA: 'PRODUCT_CLEAR_FORM_DATA',
    PRODUCT_UPDATE_PAGE_DATA: 'PRODUCT_UPDATE_PAGE_DATA'
};

export const receivedProductAction = (payload: any) => ({
    type: actionTypes.PRODUCT_RECEIVED,
    payload
});

export const productAction = (data: any) => {
    return (dispatch: any, getState: any) => {
        dispatch(receivedProductAction([])); // Clear current product data
        dispatch(showLoaderAction('Product'));

        let state = { ...getState() };
        let pageData = state.product.pageData || [];
        let request: any = {};

        if (data.searchTitle) request.description = data.searchTitle;
        if (data.searchTag) request.tags = data.searchTag;
        if (data.searchBarcode) request.barcode = data.searchBarcode;
        if (data.searchType) request.product_type = data.searchType;
        if (data.searchStatus) request.published_status = data.searchStatus;
        if (data.page > 1) request.page = pageData[data.page - 2];

        return getProducts(request)
            .then((response) => {
                dispatch(stopLoaderAction('Product'));
                pageData[data.page - 1] = response.nextCursor;
                dispatch(updateProductPageData(pageData));
                dispatch(receivedProductAction(response));
                return true;
            })
            .catch(() => {
                dispatch(stopLoaderAction('Product'));
                return false;
            });
    };
};

export const unmountProductAction = () => ({
    type: actionTypes.PRODUCT_UNMOUNT
});

export const clearProductAction = () => ({
    type: actionTypes.PRODUCT_CLEAR
});

export const receivedProductTypeAction = (payload: any) => ({
    type: actionTypes.PRODUCT_TYPE_RECEIVED,
    payload
});

export const productTypeAction = () => {
    return (dispatch: any) => {
        dispatch(showLoaderAction('ProductType'));

        return getProductType()
            .then((response) => {
                dispatch(stopLoaderAction('ProductType'));
                dispatch(receivedProductTypeAction(response));
            })
            .catch(() => {
                dispatch(stopLoaderAction('ProductType'));
            });
    };
};

export const updateProductFormData = (payload: any) => ({
    type: actionTypes.PRODUCT_UPDATE_FORM_DATA,
    payload
});

export const clearProductFormData = () => ({
    type: actionTypes.PRODUCT_CLEAR_FORM_DATA
});

export const updateProductAction = (req: any) => {
    return (dispatch: any) => {
        dispatch(showLoaderAction('UpdateProduct'));

        return updateProduct(req)
            .then(() => {
                dispatch(stopLoaderAction('UpdateProduct'));
                return true;
            })
            .catch(() => {
                dispatch(stopLoaderAction('UpdateProduct'));
                return false;
            });
    };
};

export const updateProductDescriptionAction = (req: any) => {
    return (dispatch: any) => {
        dispatch(showLoaderAction('UpdateProductDescription'));

        return updateProductDescription(req)
            .then(() => {
                dispatch(stopLoaderAction('UpdateProductDescription'));
                return true;
            })
            .catch(() => {
                dispatch(stopLoaderAction('UpdateProductDescription'));
                return false;
            });
    };
};

export const syncProductsAction = (req: any) => {
    return (dispatch: any) => {
        dispatch(showLoaderAction('SyncProducts'));

        return syncProducts(req)
            .then(() => {
                dispatch(stopLoaderAction('SyncProducts'));
                return true;
            })
            .catch(() => {
                dispatch(stopLoaderAction('SyncProducts'));
                return false;
            });
    };
};

export const updateProductPageData = (payload: any) => ({
    type: actionTypes.PRODUCT_UPDATE_PAGE_DATA,
    payload
});
