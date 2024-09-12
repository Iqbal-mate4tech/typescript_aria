import type { ThunkAction } from 'redux-thunk';

import type { AnyAction } from 'redux';

import {
  palletStatus, pallets, palletStore, palletCategory,
  palletItemsById, palletTypes, palletBuilders, savePallet,
  updatePallet, savePalletItem, deletePallet, deletePalletItem,
  updatePalletItem, palletShipper, getItemDescription, getDIDdescription,
  getITOdescription_new, getdidnumbervalid, getitonumbervalid,
  syncPrice, syncPriceStatus, getITODetails, updateOdooPalletData
} from './service';
import { showLoaderAction, stopLoaderAction } from '../user_master/action';

import type { RootState } from '../../store'; // Adjust the path according to your store

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
  PRICE_SYNC_STATUS: 'PRICE_SYNC_STATUS'
};

// TypeScript utility for defining Redux Thunks
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

// Action creators
export const receivedPalletStatusAction = (payload: any) => ({
  type: actionTypes.PALLET_STATUS_RECEIVED,
  payload
});

export const palletStatusAction = (): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('palletStatus'));

    try {
      const response = await palletStatus();

      dispatch(stopLoaderAction('palletStatus'));
      dispatch(receivedPalletStatusAction(response));
    } catch (error) {
      dispatch(stopLoaderAction('palletStatus'));
      console.error(error);
    }
  };
};

export const receivedPalletStoreAction = (payload: any) => ({
  type: actionTypes.PALLET_STORE_RECEIVED,
  payload
});

export const palletStoreAction = (): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('palletStore'));

    try {
      const response = await palletStore();

      dispatch(stopLoaderAction('palletStore'));
      dispatch(receivedPalletStoreAction(response));
    } catch (error) {
      dispatch(stopLoaderAction('palletStore'));
      console.error(error);
    }
  };
};

export const receivedPalletCategoryAction = (payload: any) => ({
  type: actionTypes.PALLET_CATEGORY_RECEIVED,
  payload
});

export const palletCategoryAction = (): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('palletCategory'));

    try {
      const response = await palletCategory();

      dispatch(stopLoaderAction('palletCategory'));
      dispatch(receivedPalletCategoryAction(response));
    } catch (error) {
      dispatch(stopLoaderAction('palletCategory'));
      console.error(error);
    }
  };
};

export const receivedPalletsAction = (payload: any) => ({
  type: actionTypes.PALLETS_RECEIVED,
  payload
});

export const palletsAction = (data: any): AppThunk => {
  return async (dispatch, getState) => {
    if (data && data.page < 2) dispatch(showLoaderAction('pallets'));

    try {
      const response = await pallets(data);

      if (data && data.page > 1) {
        const state = getState();

        response[0] = [...state.pallet.pallets[0], ...response[0]];
      }

      dispatch(receivedPalletsAction(response));
      if (data && data.page < 2) dispatch(stopLoaderAction('pallets'));
      
return true;
    } catch (error) {
      if (data && data.page < 2) dispatch(stopLoaderAction('pallets'));
      console.error(error);
      
return false;
    }
  };
};

export const unmountPalletsAction = () => ({
  type: actionTypes.PALLETS_UNMOUNT
});

export const palletsMasterDataAction = (): AppThunk => {
  return (dispatch) => {
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

export const palletItemsAction = (id: number): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('palletItems'));

    try {
      const response = await palletItemsById(id);

      dispatch(stopLoaderAction('palletItems'));
      dispatch(receivedPalletItemsAction(response));
    } catch (error) {
      dispatch(stopLoaderAction('palletItems'));
      console.error(error);
    }
  };
};

export const receivedPalletTypesAction = (payload: any) => ({
  type: actionTypes.PALLET_TYPES_RECEIVED,
  payload
});

export const palletTypesAction = (): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('palletTypes'));

    try {
      const response = await palletTypes();

      dispatch(stopLoaderAction('palletTypes'));
      dispatch(receivedPalletTypesAction(response));
    } catch (error) {
      dispatch(stopLoaderAction('palletTypes'));
      console.error(error);
    }
  };
};

export const receivedPalletBuildersAction = (payload: any) => ({
  type: actionTypes.PALLET_BUILDERS_RECEIVED,
  payload
});

export const palletBuildersAction = (): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('palletBuilders'));

    try {
      const response = await palletBuilders();

      dispatch(stopLoaderAction('palletBuilders'));
      dispatch(receivedPalletBuildersAction(response));
    } catch (error) {
      dispatch(stopLoaderAction('palletBuilders'));
      console.error(error);
    }
  };
};

export const addUpdatePalletsMasterDataAction = (): AppThunk => {
  return (dispatch) => {
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

export const savePalletAction = (data: any): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('savePallet'));

    try {
      const response = await savePallet(data);

      dispatch(stopLoaderAction('savePallet'));

      // Send pallet data to Odoo
      const palletId = response.match(/\d+/)[0];

      const palletData = {
        pallet_id: palletId,
        store_id: data.store_id,
        category: data.category,
        pallet_type: data.pallet_type,
        weight: data.weight,
        built_by: data.built_by,
        status: data.status,
        other_notes: data.other_notes,
        contents: data.contents,
        last_status_changed_by: data.last_status_changed_by,
        last_status_changed_date: data.last_status_changed_date,
        date_created: data.date_created,
        palletItems: data.palletItems,
        supplier: data.supplier,
        con_number: data.con_number,
      };

      dispatch(sendPalletToOdoo(palletData));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('savePallet'));
      console.error(error);
      
return false;
    }
  };
};

export const updatePalletAction = (data: any): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('updatePallet'));

    try {
      await updatePallet(data);
      dispatch(stopLoaderAction('updatePallet'));

      // Send pallet data to Odoo
      const palletData = {
        pallet_id: data.id,
        store_id: data.store_id,
        category: data.category,
        pallet_type: data.pallet_type,
        weight: data.weight,
        built_by: data.built_by,
        status: data.status,
        other_notes: data.other_notes,
        contents: data.contents,
        last_status_changed_by: data.last_status_changed_by,
        last_status_changed_date: data.last_status_changed_date,
        date_created: data.date_created,
        palletItems: data.palletItems,
        supplier: data.supplier,
        con_number: data.con_number,
      };

      dispatch(sendPalletToOdoo(palletData));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('updatePallet'));
      console.error(error);
      
return false;
    }
  };
};

export const sendPalletToOdoo = (palletData: any): AppThunk => {
  return async () => {
    try {
      await updateOdooPalletData(palletData);
      console.log('Pallet data sent to Odoo successfully');
    } catch (error) {
      console.error('Error sending pallet data to Odoo:', error);
    }
  };
};

export const savePalletItemAction = (data: any): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('savePalletItem'));

    try {
      await savePalletItem(data);
      dispatch(stopLoaderAction('savePalletItem'));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('savePalletItem'));
      console.error(error);
      
return false;
    }
  };
};

export const deletePalletAction = (data: number): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('deletePallet'));

    try {
      await deletePallet(data);
      dispatch(stopLoaderAction('deletePallet'));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('deletePallet'));
      console.error(error);
      
return false;
    }
  };
};

export const deletePalletItemAction = (data: number): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('deletePalletItem'));

    try {
      await deletePalletItem(data);
      dispatch(stopLoaderAction('deletePalletItem'));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('deletePalletItem'));
      console.error(error);
      
return false;
    }
  };
};

export const updatePalletItemAction = (data: any): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('updatePalletItem'));

    try {
      await updatePalletItem(data);
      dispatch(stopLoaderAction('updatePalletItem'));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('updatePalletItem'));
      console.error(error);
      
return false;
    }
  };
};

export const receivedPalletShipperAction = (payload: any) => ({
  type: actionTypes.PALLET_SHIPPER_RECEIVED,
  payload
});

export const palletShipperAction = (): AppThunk => {
  return async (dispatch) => {
    dispatch(showLoaderAction('palletShipper'));

    try {
      const response = await palletShipper();

      dispatch(stopLoaderAction('palletShipper'));
      dispatch(receivedPalletShipperAction(response));
    } catch (error) {
      dispatch(stopLoaderAction('palletShipper'));
      console.error(error);
    }
  };
};

export const updatePalletFormData = (payload: any) => ({
  type: actionTypes.PALLET_FORM_DATA,
  payload
});

export const clearFormData = () => ({
  type: actionTypes.CLEAR_PALLET_FORM_DATA
});

export const getItemDescriptionAction = (barcode: string): AppThunk => {
  return async () => {
    try {
      const response = await getItemDescription(barcode);

      
return response;
    } catch (error) {
      console.error(error);
      
return false;
    }
  };
};

// Distribution module actions
export const getDIDdescriptionAction = (did_reference: string, barcode: string): AppThunk => {
  return async () => {
    try {
      const response = await getDIDdescription(did_reference, barcode);

      
return response;
    } catch (error) {
      console.error(error);
      
return false;
    }
  };
};

export const getITOdescriptionNewAction = (ito_reference: string, barcode: string): AppThunk => {
  return async () => {
    try {
      const response = await getITOdescription_new(ito_reference, barcode);

      
return response;
    } catch (error) {
      console.error(error);
      
return false;
    }
  };
};

export const getdidnumbervalidAction = (did_number: string): AppThunk => {
  return async () => {
    try {
      const response = await getdidnumbervalid(did_number);

      
return response;
    } catch (error) {
      console.error(error);
      
return false;
    }
  };
};

export const getitonumbervalidAction = (ito_number: string): AppThunk => {
  return async () => {
    try {
      const response = await getitonumbervalid(ito_number);

      
return response;
    } catch (error) {
      console.error(error);
      
return false;
    }
  };
};

export const getITODetailsAction = (data: any): AppThunk => {
  return async () => {
    try {
      const response = await getITODetails(data);

      
return response;
    } catch (error) {
      console.error(error);
      
return false;
    }
  };
};

export const syncPriceAction = (): AppThunk => {
  return async (dispatch) => {
    dispatch(setSyncStatus(true));

    try {
      await syncPrice();
      dispatch(syncPriceStatusAction());
    } catch (error) {
      dispatch(setSyncStatus(false));
      console.error(error);
    }
  };
};

export const syncPriceStatusAction = (): AppThunk => {
  return async (dispatch) => {
    try {
      const response = await syncPriceStatus();

      if (response) {
        const isSyncComplete = response.indexOf('False') === -1;

        dispatch(setSyncStatus(isSyncComplete));
      } else {
        dispatch(setSyncStatus(false));
      }
    } catch (error) {
      dispatch(setSyncStatus(false));
      console.error(error);
    }
  };
};

export const setSyncStatus = (payload: boolean) => ({
  type: actionTypes.PRICE_SYNC_STATUS,
  payload
});
