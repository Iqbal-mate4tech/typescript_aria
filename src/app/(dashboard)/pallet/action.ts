import {
  palletStatus, pallets, palletStore, palletCategory,
  palletItemsById, palletTypes, palletBuilders, savePallet,
  updatePallet, savePalletItem, deletePallet, deletePalletItem,
  updatePalletItem, palletShipper, getItemDescription, getDIDdescription, 
  getITOdescription_new, getdidnumbervalid, getitonumbervalid,
  syncPrice, syncPriceStatus, getITODetails, updateOdooPalletData,getstorepo
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
  PRICE_SYNC_STATUS: 'PRICE_SYNC_STATUS'
} as const;

// TypeScript interface for actions
interface Action {
  type: any;
  payload?: any;
}

// Action creators
export const receivedPalletStatusAction = (payload: any): Action => ({
  type: actionTypes.PALLET_STATUS_RECEIVED,
  payload
});

export const palletStatusAction = () => {
  return async (dispatch: any) => {
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

export const receivedPalletStoreAction = (payload: any): Action => ({
  type: actionTypes.PALLET_STORE_RECEIVED,
  payload
});

export const palletStoreAction = () => {
  return async (dispatch: any) => {
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

export const receivedPalletCategoryAction = (payload: any): Action => ({
  type: actionTypes.PALLET_CATEGORY_RECEIVED,
  payload
});

export const palletCategoryAction = () => {
  return async (dispatch: any) => {
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

export const receivedPalletsAction = (payload: any): Action => ({
  type: actionTypes.PALLETS_RECEIVED,
  payload
});

export const palletsAction = (data: any) => {
  return async (dispatch: any, getState: any) => {
      if (data && data.page < 2) dispatch(showLoaderAction('pallets'));

      try {
          const response = await pallets(data);

          if (data && data.page < 2) dispatch(stopLoaderAction('pallets'));

          if (data && data.page > 1) {
            const state = Object.assign({}, getState());

              response[0] = [...state.pallet.pallets[0], ...response[0]];
          }

          dispatch(receivedPalletsAction(response));
          
return true;
      } catch (error) {
          if (data && data.page < 2) dispatch(stopLoaderAction('pallets'));
          
return false;
      }
  };
};



export const unmountPalletsAction = () => ({
  type: actionTypes.PALLETS_UNMOUNT
});

export const palletsMasterDataAction = () => {
  return (dispatch: any) => {
      dispatch(palletStoreAction());
      dispatch(palletCategoryAction());
      dispatch(palletStatusAction());
  };
};

export const clearPalletsAction = () => ({
  type: actionTypes.PALLETS_CLEAR
});

export const receivedPalletItemsAction = (payload: any): Action => ({
  type: actionTypes.PALLET_ITEMS_RECEIVED,
  payload
});

export const palletItemsAction = (id: string) => {
  return async (dispatch: any) => {
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

export const receivedPalletTypesAction = (payload: any): Action => ({
  type: actionTypes.PALLET_TYPES_RECEIVED,
  payload
});

export const palletTypesAction = () => {
  return async (dispatch: any) => {
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

export const receivedPalletBuildersAction = (payload: any): Action => ({
  type: actionTypes.PALLET_BUILDERS_RECEIVED,
  payload
});

export const palletBuildersAction = () => {
  return async (dispatch: any) => {
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
  return (dispatch: any) => {
      dispatch(palletTypesAction());
      dispatch(palletBuildersAction());

      // need some attention
      dispatch(palletStoreAction());
      dispatch(palletCategoryAction());
      dispatch(palletStatusAction());
  };
};

export const addItemToListAction = (payload: any): Action => ({
  type: actionTypes.PALLET_ADD_ITEM_TO_LIST,
  payload
});

export const unMountAddUpdateData = (): Action => ({
  type: actionTypes.PALLET_ADD_UPDATE_UNMOUNT
});

export const savePalletAction = (data: any) => {
  return async (dispatch: any) => {
      dispatch(showLoaderAction('savePallet'));

      try {
          const response = await savePallet(data);

          dispatch(stopLoaderAction('savePallet'));

          const palletId = response.pallet_id;
          const palletItemIds = response.pallet_item_ids || [];

          const updatedPalletItems = data.palletItems && Array.isArray(data.palletItems)
              ? data.palletItems.map((item: any, index: number) => ({
                  ...item,
                  id: palletItemIds[index] || null
              }))
              : [];

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
              palletItems: updatedPalletItems,
              supplier: data.supplier,
              con_number: data.con_number,
              pallet_store_po : data.pallet_store_po,
              wrapped_date : data.wrapped_date,
          };

          dispatch(sendPalletToOdoo(palletData));
          
return true;
      } catch (error) {
          dispatch(stopLoaderAction('savePallet'));
          
return false;
      }
  };
};

export const updatePalletAction = (data: any) => {
  return async (dispatch: any) => {
      dispatch(showLoaderAction('updatePallet'));

      try {
          const response = await updatePallet(data);

          dispatch(stopLoaderAction('updatePallet'));

          if (!data.id || !data.built_by) {
              console.error("pallet_id and built_by are required.");
              
return false;
          }

          const filteredData = Object.keys(data).reduce((acc: any, key: string) => {
              if (data[key] !== null && data[key] !== "") {
                  acc[key] = data[key];
              }

              
return acc;
          }, {});

          const palletData = {
              pallet_id: data.id,
              built_by: data.built_by,
              ...filteredData
          };

          dispatch(sendPalletToOdoo(palletData));
          
return true;
      } catch (error) {
          dispatch(stopLoaderAction('updatePallet'));
          
return false;
      }
  };
};

export const sendPalletToOdoo = (palletData: any) => {
  return async (dispatch: any) => {
      try {
          await updateOdooPalletData(palletData);
          console.log('Pallet data sent to Odoo successfully');
      } catch (error) {
          console.error('Error sending pallet data to Odoo:', error);
      }
  };
};

export const savePalletItemAction = (data: any) => {
  return async (dispatch: any) => {
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

export const deletePalletAction = (data: any) => {
  return async (dispatch: any) => {
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

export const deletePalletItemAction = (data: any) => {
  return async (dispatch: any) => {
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
  return async (dispatch: any) => {
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

export const receivedPalletShipperAction = (payload: any): Action => ({
  type: actionTypes.PALLET_SHIPPER_RECEIVED,
  payload
});

export const palletShipperAction = () => {
  return async (dispatch: any) => {
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

export const updatePalletFormData = (payload: any): Action => ({
  type: actionTypes.PALLET_FORM_DATA,
  payload
});

export const clearFormData = (payload:any): Action => ({
  type: actionTypes.CLEAR_PALLET_FORM_DATA,
  payload
});

export const getItemDescriptionAction = (barcode: any) => {
  return async () => {
      try {
          const response = await getItemDescription(barcode);
          

return response;
      } catch (error) {
          return false;
      }
  };
};

export const getDIDdescriptionAction = (did_reference: any, barcode: any) => {
  return async () => {
      try {
          const response = await getDIDdescription(did_reference, barcode);

          
return response;
      } catch (error) {
          return false;
      }
  };
};

export const getITOdescriptionNewAction = (ito_reference: any, barcode: any) => {
  return async () => {
      try {
          const response = await getITOdescription_new(ito_reference, barcode);

          
return response;
      } catch (error) {
          return false;
      }
  };
};

export const getdidnumbervalidAction = (did_number: any, store_id: any) => {
  return async () => {
      try {
          const response = await getdidnumbervalid(did_number, store_id);

          
return response;
      } catch (error) {
          return false;
      }
  };
};

export const getitonumbervalidAction = (ito_number: any) => {
  return async () => {
      try {
          const response = await getitonumbervalid(ito_number);

          return response;
      } catch (error) {
          return false;
      }
  };
};

export const getstorepoAction = (store_id:any) => {

  return async () => {
    try{
      const response = await getstorepo(store_id);

      
return response;
    }catch (error) {
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
  return async (dispatch: any) => {
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
  return async (dispatch: any) => {
      try {
          const response = await syncPriceStatus();

          if (response) {
              const status = response.indexOf('False') > -1;

              dispatch(setSyncStatus(!status));
          } else {
              dispatch(setSyncStatus(false));
          }
      } catch (error) {
          dispatch(setSyncStatus(false));
      }
  };
};

export const setSyncStatus = (payload: boolean): Action => ({
  type: actionTypes.PRICE_SYNC_STATUS,
  payload
});
