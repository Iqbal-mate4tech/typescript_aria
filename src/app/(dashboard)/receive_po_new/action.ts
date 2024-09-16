import { AppDispatch} from '../../store';

import {
    getPoid,
    addPoItems,
    receivePO,
  } from './service';
  import { showLoaderAction, stopLoaderAction } from '../user_master/action';
  
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
    VALIDATE_STORE_ID: 'VALIDATE_STORE_ID',
    PRICE_SYNC_STATUS: 'PRICE_SYNC_STATUS',
  };
  
  // Define types for your payloads and state
  interface BarcodeScanAction {
    type: typeof actionTypes.BARCODE_SCAN;
    payload: any;
  }
  
  interface POItem {
    poId: string;
    items: any[];

    // add other fields as necessary
  }
  
  // Action creator types
  type BarcodeScanActionType = (payload: any) => BarcodeScanAction;
  
  // Define the thunk action types
  type ThunkResult<R> = (dispatch: AppDispatch, getState: () => any) => R;
  
  // Action creators
  export const setBarcodeScan: BarcodeScanActionType = (payload) => ({
    type: actionTypes.BARCODE_SCAN,
    payload,
  });
  
  export const getPOIDDescriptionAction = (poid: string): ThunkResult<Promise<boolean | any>> => {
    return async (dispatch, getState) => {
      dispatch(showLoaderAction('barcodeScan'));
  
      try {
        const response = await getPoid(poid);

        if (response.length) {
          dispatch(setBarcodeScan(response));
          
return response;
        }
  
        return false;
      } catch (error) {
        dispatch(setBarcodeScan(null));
        dispatch(stopLoaderAction('barcodeScan'));
        
return false;
      }
    };
  };
  
  export const addPoItemsAction = (data: POItem): ThunkResult<Promise<boolean>> => {
    return async (dispatch) => {
      dispatch(showLoaderAction('addPoItems'));
  
      try {
        await addPoItems(data);
        dispatch(stopLoaderAction('addPoItems'));
        
return true;
      } catch (error) {
        dispatch(stopLoaderAction('addPoItems'));
        
return false;
      }
    };
  };
  
  export const receivePOAction = (data: POItem): ThunkResult<Promise<any>> => {
    return async (dispatch) => {
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
  