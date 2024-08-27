import {
    barcodeScanApi,
    updateQty,
    validateStoreId,
    palletStatus,
    pallets,
    palletStore,
    palletCategory,
    palletItemsById,
    palletTypes,
    palletBuilders,
    savePallet,
    updatePallet,
    savePalletItem,
    deletePallet,
    deletePalletItem,
    updatePalletItem,
    palletShipper,
    getItemDescription,
    syncPrice,
    syncPriceStatus,
    getITODetails,
    getPoid,
    receivePO
} from './service';
import { showLoaderAction, stopLoaderAction } from '../user_master/action';
import { Dispatch } from 'redux';

/**
 * Action types
 */
export const actionTypes = {
    PALLET_STATUS_RECEIVED: 'PALLET_STATUS_RECEIVED',
    PALLET_CATEGORY_RECEIVED: 'PALLET_CATEGORY_RECEIVED',
    PALLET_STORE_RECEIVED: 'PALLET_STORE_RECEIVED',
    PALLETS_RECEIVED: 'PALLETS_RECEIVED',
    PALLETS_UNMOUNT: 'PALLETS_UNMOUNT',
    PALLETS_CLEAR: 'PALLETS_CLEAR',
    PALLET_ITEMS_RECEIVED: 'PALLET_ITEMS_RECEIVED',
    PALLET_BUILDERS_RECEIVED: 'PALLET_BUILDERS_RECEIVED',
    PALLET_TYPES_RECEIVED: 'PALLET_TYPES_RECEIVED',
    PALLET_ADD_ITEM_TO_LIST: 'PALLET_ADD_ITEM_TO_LIST',
    PALLET_ADD_UPDATE_UNMOUNT: 'PALLET_ADD_UPDATE_UNMOUNT',
    PALLET_SHIPPER_RECEIVED: 'PALLET_SHIPPER_RECEIVED',
    CLEAR_PALLET_FORM_DATA: 'CLEAR_PALLET_FORM_DATA',
    PALLET_FORM_DATA: 'PALLET_FORM_DATA',
    BARCODE_SCAN: 'BARCODE_SCAN',
    BARCODE_SCAN_PO: 'BARCODE_SCAN_PO',
    VALIDATE_STORE_ID: 'VALIDATE_STORE_ID',
    PRICE_SYNC_STATUS: 'PRICE_SYNC_STATUS'
};

export const setBarcodeScan = (payload: any) => ({
    type: actionTypes.BARCODE_SCAN,
    payload
});

export const getITODescriptionAction = (itoNumber: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('barcodeScan'));

        try {
            const response = await barcodeScanApi(itoNumber);
            if (response.length) {
                dispatch(setBarcodeScan(response));
                return response;
            }
            return false;
        } catch (error) {
            dispatch(setBarcodeScan(null));
            return false;
        }
    };
};

export const setBarcodeScanPO = (payload: any) => ({
    type: actionTypes.BARCODE_SCAN_PO,
    payload
});

export const getPODescriptionAction = (itoNumber: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('barcodeScanPo'));

        try {
            const response = await getPoid(itoNumber);
            if (response.length) {
                dispatch(setBarcodeScanPO(response));
                return response;
            }
            return false;
        } catch (error) {
            dispatch(setBarcodeScanPO(null));
            return false;
        }
    };
};

export const receivePOAction = (data: any) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('receivePO'));

        try {
            const response = await receivePO(data);
            dispatch(stopLoaderAction('receivePO'));
            return response;
        } catch (error) {
            dispatch(stopLoaderAction('receivePO'));
            return false;
        }
    };
};

export const updateCartonQtyAction = (data: any) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('updateQty'));

        try {
            const response = await updateQty(data);
            dispatch(stopLoaderAction('updateQty'));
            return response;
        } catch (error) {
            dispatch(stopLoaderAction('updateQty'));
            return false;
        }
    };
};

export const validateIdAction = (payload: any) => ({
    type: actionTypes.VALIDATE_STORE_ID,
    payload
});

export const validateStoreIdAction = (pallet_id: number, ito_id: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('validateStoreId'));

        try {
            const response = await validateStoreId(pallet_id, ito_id);
            dispatch(stopLoaderAction('validateStoreId'));
            dispatch(validateIdAction(response));
            return response;
        } catch (error) {
            dispatch(stopLoaderAction('validateStoreId'));
            return false;
        }
    };
};

export const receivedPalletStatusAction = (payload: any) => ({
    type: actionTypes.PALLET_STATUS_RECEIVED,
    payload
});

export const palletStatusAction = () => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('palletStatus'));

        try {
            const response = await palletStatus();
            dispatch(stopLoaderAction('palletStatus'));
            dispatch(receivedPalletStatusAction(response));
        } catch (error) {
            dispatch(stopLoaderAction('palletStatus'));
        }
    };
};

export const receivedPalletStoreAction = (payload: any) => ({
    type: actionTypes.PALLET_STORE_RECEIVED,
    payload
});

export const palletStoreAction = () => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('palletStore'));

        try {
            const response = await palletStore();
            dispatch(stopLoaderAction('palletStore'));
            dispatch(receivedPalletStoreAction(response));
        } catch (error) {
            dispatch(stopLoaderAction('palletStore'));
        }
    };
};

export const receivedPalletCategoryAction = (payload: any) => ({
    type: actionTypes.PALLET_CATEGORY_RECEIVED,
    payload
});

export const palletCategoryAction = () => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('palletCategory'));

        try {
            const response = await palletCategory();
            dispatch(stopLoaderAction('palletCategory'));
            dispatch(receivedPalletCategoryAction(response));
        } catch (error) {
            dispatch(stopLoaderAction('palletCategory'));
        }
    };
};

export const receivedPalletsAction = (payload: any) => ({
    type: actionTypes.PALLETS_RECEIVED,
    payload
});

export const palletsAction = (data: any) => {
    return async (dispatch: Dispatch, getState: any) => {
        if (data && data.page < 2) {
            dispatch(showLoaderAction('pallets'));
        }

        try {
            let response = await pallets(data);

            if (data && data.page > 1) {
                const state = getState();
                response[0] = [...state.pallet.pallets[0], ...response[0]];
            }

            dispatch(receivedPalletsAction(response));
            if (data && data.page < 2) {
                dispatch(stopLoaderAction('pallets'));
            }
            return true;
        } catch (error) {
            if (data && data.page < 2) {
                dispatch(stopLoaderAction('pallets'));
            }
            return false;
        }
    };
};

export const unmountPalletsAction = () => ({
    type: actionTypes.PALLETS_UNMOUNT
});

export const palletsMasterDataAction = () => {
    return (dispatch: Dispatch) => {
        dispatch(palletStoreAction());
        dispatch(palletCategoryAction());
        dispatch(palletStatusAction());
    };
};

export const clearPalletsAction = () => ({
    type: actionTypes.PALLETS_CLEAR
});

export const receivedPalletItemsAction = (payload: any) => ({
    type: actionTypes.PALLET_ITEMS_RECEIVED,
    payload
});

export const palletItemsAction = (id: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('palletItems'));

        try {
            const response = await palletItemsById(id);
            dispatch(stopLoaderAction('palletItems'));
            dispatch(receivedPalletItemsAction(response));
        } catch (error) {
            dispatch(stopLoaderAction('palletItems'));
        }
    };
};

export const receivedPalletTypesAction = (payload: any) => ({
    type: actionTypes.PALLET_TYPES_RECEIVED,
    payload
});

export const palletTypesAction = () => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('palletTypes'));

        try {
            const response = await palletTypes();
            dispatch(stopLoaderAction('palletTypes'));
            dispatch(receivedPalletTypesAction(response));
        } catch (error) {
            dispatch(stopLoaderAction('palletTypes'));
        }
    };
};

export const receivedPalletBuildersAction = (payload: any) => ({
    type: actionTypes.PALLET_BUILDERS_RECEIVED,
    payload
});

export const palletBuildersAction = () => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('palletBuilders'));

        try {
            const response = await palletBuilders();
            dispatch(stopLoaderAction('palletBuilders'));
            dispatch(receivedPalletBuildersAction(response));
        } catch (error) {
            dispatch(stopLoaderAction('palletBuilders'));
        }
    };
};

export const addUpdatePalletsMasterDataAction = () => {
    return (dispatch: Dispatch) => {
        dispatch(palletTypesAction());
        dispatch(palletBuildersAction());
    };
};

export const addItemToListAction = (payload: any) => ({
    type: actionTypes.PALLET_ADD_ITEM_TO_LIST,
    payload
});

export const unMountAddUpdateData = () => ({
    type: actionTypes.PALLET_ADD_UPDATE_UNMOUNT
});

export const savePalletAction = (data: any) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('savePallet'));

        try {
            await savePallet(data);
            dispatch(stopLoaderAction('savePallet'));
            return true;
        } catch (error) {
            dispatch(stopLoaderAction('savePallet'));
            return false;
        }
    };
};

export const updatePalletAction = (data: any) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('updatePallet'));

        try {
            await updatePallet(data);
            dispatch(stopLoaderAction('updatePallet'));
            return true;
        } catch (error) {
            dispatch(stopLoaderAction('updatePallet'));
            return false;
        }
    };
};

export const savePalletItemAction = (data: any) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('savePalletItem'));

        try {
            await savePalletItem(data);
            dispatch(stopLoaderAction('savePalletItem'));
            return true;
        } catch (error) {
            dispatch(stopLoaderAction('savePalletItem'));
            return false;
        }
    };
};

export const deletePalletAction = (data: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('deletePallet'));

        try {
            await deletePallet(data);
            dispatch(stopLoaderAction('deletePallet'));
            return true;
        } catch (error) {
            dispatch(stopLoaderAction('deletePallet'));
            return false;
        }
    };
};

export const deletePalletItemAction = (data: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('deletePalletItem'));

        try {
            await deletePalletItem(data);
            dispatch(stopLoaderAction('deletePalletItem'));
            return true;
        } catch (error) {
            dispatch(stopLoaderAction('deletePalletItem'));
            return false;
        }
    };
};

export const updatePalletItemAction = (data: any) => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('updatePalletItem'));

        try {
            await updatePalletItem(data);
            dispatch(stopLoaderAction('updatePalletItem'));
            return true;
        } catch (error) {
            dispatch(stopLoaderAction('updatePalletItem'));
            return false;
        }
    };
};

export const receivedPalletShipperAction = (payload: any) => ({
    type: actionTypes.PALLET_SHIPPER_RECEIVED,
    payload
});

export const palletShipperAction = () => {
    return async (dispatch: Dispatch) => {
        dispatch(showLoaderAction('palletShipper'));

        try {
            const response = await palletShipper();
            dispatch(stopLoaderAction('palletShipper'));
            dispatch(receivedPalletShipperAction(response));
        } catch (error) {
            dispatch(stopLoaderAction('palletShipper'));
        }
    };
};

export const updatePalletFormData = (payload: any) => ({
    type: actionTypes.PALLET_FORM_DATA,
    payload
});

export const clearFormData = (payload: any) => ({
    type: actionTypes.CLEAR_PALLET_FORM_DATA,
    payload
});

export const getItemDescriptionAction = (data: string) => {
    return async () => {
        try {
            const response = await getItemDescription(data);
            return response;
        } catch (error) {
            return false;
        }
    };
};

export const getITODetailsAction = (data: any) => {
    return async () => {
        try {
            const response = await getITODetails(data);
            return response;
        } catch (error) {
            return false;
        }
    };
};

export const syncPriceAction = () => {
    return async (dispatch: Dispatch) => {
        dispatch(setSyncStatus(true));

        try {
            await syncPrice();
            dispatch(syncPriceStatusAction());
        } catch (error) {
            dispatch(setSyncStatus(false));
        }
    };
};

export const syncPriceStatusAction = () => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await syncPriceStatus();
            if (response) {
                const isSynced = response.indexOf('False') > -1;
                dispatch(setSyncStatus(!isSynced));
            } else {
                dispatch(setSyncStatus(false));
            }
        } catch (error) {
            dispatch(setSyncStatus(false));
        }
    };
};

export const setSyncStatus = (payload: boolean) => ({
    type: actionTypes.PRICE_SYNC_STATUS,
    payload
});
