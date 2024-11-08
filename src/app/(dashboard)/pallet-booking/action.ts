import { AppDispatch} from '../../store';

import { palletStoreAction, palletShipperAction, receivedPalletsAction } from '../pallet/action';
import { palletByStatus, updatePalletShippingStatus } from '../pallet/service';
import { stopLoaderAction, showLoaderAction } from '../../(dashboard)/user_master/action';

// interface PalletByStatusData {
//   page: number;
//   [key: string]: any;
// }

// interface UpdatePalletShippingStatusData {
//   [key: string]: any;
// }

export const palletBookingMasterDataAction = () => {
  return (dispatch: AppDispatch) => {
    dispatch(palletShipperAction());
    dispatch(palletStoreAction());
  };
};

export const palletByStatusAction = (data: any) => {
  return async (dispatch: AppDispatch, getState: () => any) => {
    if (data && data.page < 2) {
      dispatch(showLoaderAction('palletByStatus'));
    }

    try {
      const response = await palletByStatus(data);

      if (data && data.page < 2) {
        dispatch(stopLoaderAction('palletByStatus'));
      }

      if (data && data.page > 1) {
        const state = Object.assign({}, getState());

        response[0] = [...state.pallet.pallets[0], ...response[0]];
      }

      dispatch(receivedPalletsAction(response));
      
return true;
    } catch (error) {
      if (data && data.page < 2) {
        dispatch(stopLoaderAction('palletByStatus'));
      }

      
return false;
    }
  };
};

export const updatePalletShippingStatusAction = (data: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(showLoaderAction('updatePalletShippingStatus'));

    try {
      await updatePalletShippingStatus(data);
      dispatch(stopLoaderAction('updatePalletShippingStatus'));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('updatePalletShippingStatus'));
      
return false;
    }
  };
};
