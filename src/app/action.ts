import { showLoaderAction, stopLoaderAction } from './(dashboard)/user_master/action';
import {
  addUpdateShipper,
  deleteShipper,
  addUpdatePalletType,
  deletePalletType,
  addUpdateUsers,
  deleteUser,
  addUpdateCategory,
  deleteCategory,
} from './service';
import { AppDispatch} from '../app/store';

// // Define interfaces for the request objects
// interface ShipperData {
//   shipper_id?: number;
//   shipper_name: string;
// }

// interface PalletTypeData {
//   id?: number;
//   type: string;
// }

// interface UserData {
//   id?: number;
//   username: string;
//   password: string;
//   is_admin: number;
//   user_type: string;
//   store_access_id: string;
// }

// interface CategoryData {
//   category_id?: number;
//   category_name: string;
// }

// Define the actions using TypeScript types

export const addUpdateShipperAction = (req: any)  => {
  return async (dispatch:AppDispatch) => {
    dispatch(showLoaderAction('AddUpdateShipper'));

    try {
      await addUpdateShipper(req);
      dispatch(stopLoaderAction('AddUpdateShipper'));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('AddUpdateShipper'));
      
return false;
    }
  };
};

export const deleteShipperAction = (id: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(showLoaderAction('DeleteShipper'));

    try {
      await deleteShipper(id);
      dispatch(stopLoaderAction('DeleteShipper'));
      
return true;
    } catch (error) {
      console.error('Error in deleteShipperAction:', error);
      dispatch(stopLoaderAction('DeleteShipper'));
      
return false;
    }
  };
};

export const addUpdatePalletTypeAction = (req: any) => {
  return async (dispatch : AppDispatch) => {
    dispatch(showLoaderAction('addUpdatePalletType'));

    try {
      await addUpdatePalletType(req);
      dispatch(stopLoaderAction('addUpdatePalletType'));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('addUpdatePalletType'));
      
return false;
    }
  };
};

export const deletePalletTypeAction = (id: any) => {
  return async (dispatch : AppDispatch) => {
    dispatch(showLoaderAction('deletePalletType'));

    try {
      await deletePalletType(id);
      dispatch(stopLoaderAction('deletePalletType'));
      
return true;
    } catch (error) {
      console.error('Error in deletePalletTypeAction:', error);
      dispatch(stopLoaderAction('deletePalletType'));
      
return false;
    }
  };
};

export const addUpdateUserAction = (req: any) => {
  return async (dispatch : AppDispatch) => {
    dispatch(showLoaderAction('addUpdateUsers'));

    try {
      await addUpdateUsers(req);
      dispatch(stopLoaderAction('addUpdateUsers'));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('addUpdateUsers'));
      
return false;
    }
  };
};

export const deleteUserAction = (id: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(showLoaderAction('deleteUser'));

    try {
      await deleteUser(id);
      dispatch(stopLoaderAction('deleteUser'));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('deleteUser'));
      
return false;
    }
  };
};

export const addUpdateCategoryAction = (req: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(showLoaderAction('addUpdateCategory'));

    try {
      await addUpdateCategory(req);
      dispatch(stopLoaderAction('addUpdateCategory'));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('addUpdateCategory'));
      
return false;
    }
  };
};

export const deleteCategoryAction = (id: any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(showLoaderAction('deleteCategory'));

    try {
      await deleteCategory(id);
      dispatch(stopLoaderAction('deleteCategory'));
      
return true;
    } catch (error) {
      dispatch(stopLoaderAction('deleteCategory'));
      
return false;
    }
  };
};
