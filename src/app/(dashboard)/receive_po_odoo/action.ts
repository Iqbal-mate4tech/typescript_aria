import {
    getpo,
    AddPoItems,
    receivePO,
    updateqty,
  } from './service';
  import { showLoaderAction, stopLoaderAction } from '../user_master/action';
  import { Dispatch } from 'redux';
  
  // Define the structure of the payloads
  interface BarcodeScanPayload {
    SupplierSku: string;
    QtyOrdered: number;
    QtyReceived: number;
    [key: string]: any;
  }
  
  interface PoItem {
    orderline_id: string | number;
    qty_to_receive: number;
  }
  
  interface ReceivePOData {
    poId: string;
    items: BarcodeScanPayload[];
    // Additional fields if required
  }
  
  // Define the structure of the Redux state
  interface RootState {
    barcodeScan: BarcodeScanPayload[];
    // Additional state properties
  }
  
  // Define Action Types
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
    PO_QUANTIY_RECEIVED_ODOO: 'PO_QUANTIY_RECEIVED_ODOO',
    VALIDATE_STORE_ID: 'VALIDATE_STORE_ID',
    PRICE_SYNC_STATUS: 'PRICE_SYNC_STATUS',
  };
  
  // Action Creators
  export const setBarcodeScan = (payload: BarcodeScanPayload[]) => ({
    type: actionTypes.BARCODE_SCAN,
    payload,
  });
  
  export const getPOIDdescriptionAction = (poId: string) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
      dispatch(showLoaderAction('barcodeScan'));
      try {
        const response = await getpo(poId);
        if (response.length) {
          dispatch(setBarcodeScan(response));
          return response;
        }
        return true;
      } catch (error) {
        dispatch(setBarcodeScan([]));
        return false;
      }
    };
  };
  
  export const AddPoItemsAction = (data: PoItem[]) => {
    return async (dispatch: Dispatch) => {
      dispatch(showLoaderAction('addPoItems'));
      try {
        await AddPoItems(data);
        dispatch(stopLoaderAction('addPoItems'));
        return true;
      } catch (error) {
        dispatch(stopLoaderAction('addPoItems'));
        return false;
      }
    };
  };
  
  export const receivedPOQuantityOdooAction = (payload: any) => ({
    type: actionTypes.PO_QUANTIY_RECEIVED_ODOO,
    payload,
  });
  
  export const UpdateQtytoOdooAction = (data: PoItem) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
      dispatch(showLoaderAction('poOdooQuantity'));
      try {
        const response = await updateqty(data.orderline_id, data.qty_to_receive);
        dispatch(stopLoaderAction('poOdooQuantity'));
        dispatch(receivedPOQuantityOdooAction(response));
        return response;
      } catch (error) {
        dispatch(stopLoaderAction('poOdooQuantity'));
        return false;
      }
    };
  };
  
  export const receivePOAction = (data: ReceivePOData) => {
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
  