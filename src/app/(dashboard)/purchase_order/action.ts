// src/containers/purchase-order/action.ts
import { AppDispatch} from '../../store';

import {
    poItems,
    poItemsById,
    poQuantity,
    poStatus,
    poStatusAndItemCount,
    receivePO,
    uploadPO
  } from './service';
  import { showLoaderAction, stopLoaderAction } from '../user_master/action';
  import { palletStore } from '../pallet/service';
  
  /**
   * Action types
   */
  export const actionTypes = {
    PO_RECEIVED: 'PO_RECEIVED',
    PO_ITEMS_RECEIVED: 'PO_ITEMS_RECEIVED',
    PO_UNMOUNT: 'PO_UNMOUNT',
    PO_CLEAR: 'PO_CLEAR',
    PO_STATUS_RECEIVED: 'PO_STATUS_RECEIVED',
    PO_STORE_RECEIVED: 'PO_STORE_RECEIVED',
    PO_QUANTITY_RECEIVED: 'PO_QUANTITY_RECEIVED'
  };
  
  interface Action {
    type: any;
    payload?: any;
  }
  
  export const receivedPOAction = (payload: any):Action => ({
    type: actionTypes.PO_RECEIVED,
    payload
  });
  
  export const poAction = (data: any) => {
    return async (dispatch: AppDispatch, getState: () => any) => {
      if (data && data.page < 2) dispatch(showLoaderAction('poItems'));
  
      try {
        const response = await poItems(data);
  
        if (data && data.page < 2) dispatch(stopLoaderAction('poItems'));
  
        if (data && data.page > 1) {
          const state = Object.assign({}, getState());

          response[0] = [...state.purchaseOrder.po[0], ...response[0]];
        }
  
        dispatch(receivedPOAction(response));
        
return true;
      } catch (error) {
        if (data && data.page < 2) dispatch(stopLoaderAction('poItems'));
        
return false;
      }
    };
  };
  
  export const unmountPOAction = () => ({
    type: actionTypes.PO_UNMOUNT
  });
  
  export const clearPOAction = () => ({
    type: actionTypes.PO_CLEAR
  });
  
  export const receivedPOItemsAction = (payload: any):Action => ({
    type: actionTypes.PO_ITEMS_RECEIVED,
    payload
  });
  
  export const poItemsAction = (id: any) => {
    return async (dispatch: AppDispatch) => {
      dispatch(showLoaderAction('pOItems'));
  
      try {
        const response = await poItemsById(id);

        dispatch(stopLoaderAction('pOItems'));
        dispatch(receivedPOItemsAction(response));
      } catch (error) {
        dispatch(stopLoaderAction('pOItems'));
      }
    };
  };
  
  export const poMasterDataAction = () => {
    return (dispatch: AppDispatch) => {
      dispatch(poStatusAction());
      dispatch(poStoreAction());
    };
  };
  
  export const receivedPOStatusAction = (payload: any):Action => ({
    type: actionTypes.PO_STATUS_RECEIVED,
    payload
  });
  
  export const poStatusAction = () => {
    return async (dispatch: AppDispatch) => {
      dispatch(showLoaderAction('poStatus'));
  
      try {
        const response = await poStatus();

        dispatch(stopLoaderAction('poStatus'));
        dispatch(receivedPOStatusAction(response));
      } catch (error) {
        dispatch(stopLoaderAction('poStatus'));
      }
    };
  };
  
  export const receivedPOStoreAction = (payload: any):Action => ({
    type: actionTypes.PO_STORE_RECEIVED,
    payload
  });
  
  export const poStoreAction = () => {
    return async (dispatch: AppDispatch) => {
      dispatch(showLoaderAction('poStore'));
  
      try {
        const response = await palletStore();

        dispatch(stopLoaderAction('poStore'));
        dispatch(receivedPOStoreAction(response));
      } catch (error) {
        dispatch(stopLoaderAction('poStore'));
      }
    };
  };
  
  export const receivedPOQuantityAction = (payload: any):Action => ({
    type: actionTypes.PO_QUANTITY_RECEIVED,
    payload
  });
  
  export const poQuantityAction = (data: { searchPOId: any; supplierSku: any }) => {
    return async (dispatch: AppDispatch) => {
      dispatch(showLoaderAction('poQuantity'));
  
      try {
        const response = await poQuantity(data.searchPOId, data.supplierSku);

        dispatch(stopLoaderAction('poQuantity'));
        dispatch(receivedPOQuantityAction(response));
        
return response;
      } catch (error) {
        dispatch(stopLoaderAction('poQuantity'));
        
return false;
      }
    };
  };
  
  export const receivePOAction = (data: any) => {
    return async (dispatch: AppDispatch) => {
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
  
  export const uploadPOAction = (data: any) => {
    return async (dispatch: AppDispatch) => {
      dispatch(showLoaderAction('uploadPO'));
  
      try {
        const response = await uploadPO(data);

        dispatch(stopLoaderAction('uploadPO'));
        
return response;
      } catch (error) {
        dispatch(stopLoaderAction('uploadPO'));
        
return false;
      }
    };
  };
  
  export const poStatusAndItemCountAction = (data: any) => {
    return async (dispatch: AppDispatch) => {
      dispatch(showLoaderAction('poStatusAndItemCount'));
  
      try {
        const response = await poStatusAndItemCount(data);

        dispatch(stopLoaderAction('poStatusAndItemCount'));
        
return response;
      } catch (error) {
        dispatch(stopLoaderAction('poStatusAndItemCount'));
        
return false;
      }
    };
  };
  