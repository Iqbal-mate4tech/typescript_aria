import { AppThunk } from './store';
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

// Define interfaces for the request objects
interface ShipperData {
  shipper_id?: number;
  shipper_name: string;
}

interface PalletTypeData {
  id?: number;
  type: string;
}

interface UserData {
  id?: number;
  username: string;
  password: string;
  is_admin: number;
  user_type: string;
  store_access_id: string;
}

interface CategoryData {
  category_id?: number;
  category_name: string;
}

// Define the actions using TypeScript types

export const addUpdateShipperAction = (req: ShipperData): AppThunk<Promise<boolean>> => {
  return async (dispatch) => {
    dispatch(showLoaderAction('AddUpdateShipper'));

    try {
      await addUpdateShipper(req);
      dispatch(stopLoaderAction('AddUpdateShipper'));
      return true;
    } catch (error) {
      console.error('Error in addUpdateShipperAction:', error);
      dispatch(stopLoaderAction('AddUpdateShipper'));
      return false;
    }
  };
};

export const deleteShipperAction = (id: number): AppThunk<Promise<boolean>> => {
  return async (dispatch) => {
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

export const addUpdatePalletTypeAction = (req: PalletTypeData): AppThunk<Promise<boolean>> => {
  return async (dispatch) => {
    dispatch(showLoaderAction('addUpdatePalletType'));

    try {
      await addUpdatePalletType(req);
      dispatch(stopLoaderAction('addUpdatePalletType'));
      return true;
    } catch (error) {
      console.error('Error in addUpdatePalletTypeAction:', error);
      dispatch(stopLoaderAction('addUpdatePalletType'));
      return false;
    }
  };
};

export const deletePalletTypeAction = (id: number): AppThunk<Promise<boolean>> => {
  return async (dispatch) => {
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

export const addUpdateUserAction = (req: UserData): AppThunk<Promise<boolean>> => {
  return async (dispatch) => {
    dispatch(showLoaderAction('addUpdateUsers'));

    try {
      await addUpdateUsers(req);
      dispatch(stopLoaderAction('addUpdateUsers'));
      return true;
    } catch (error) {
      console.error('Error in addUpdateUserAction:', error);
      dispatch(stopLoaderAction('addUpdateUsers'));
      return false;
    }
  };
};

export const deleteUserAction = (id: number): AppThunk<Promise<boolean>> => {
  return async (dispatch) => {
    dispatch(showLoaderAction('deleteUser'));

    try {
      await deleteUser(id);
      dispatch(stopLoaderAction('deleteUser'));
      return true;
    } catch (error) {
      console.error('Error in deleteUserAction:', error);
      dispatch(stopLoaderAction('deleteUser'));
      return false;
    }
  };
};

export const addUpdateCategoryAction = (req: CategoryData): AppThunk<Promise<boolean>> => {
  return async (dispatch) => {
    dispatch(showLoaderAction('addUpdateCategory'));

    try {
      await addUpdateCategory(req);
      dispatch(stopLoaderAction('addUpdateCategory'));
      return true;
    } catch (error) {
      console.error('Error in addUpdateCategoryAction:', error);
      dispatch(stopLoaderAction('addUpdateCategory'));
      return false;
    }
  };
};

export const deleteCategoryAction = (id: number): AppThunk<Promise<boolean>> => {
  return async (dispatch) => {
    dispatch(showLoaderAction('deleteCategory'));

    try {
      await deleteCategory(id);
      dispatch(stopLoaderAction('deleteCategory'));
      return true;
    } catch (error) {
      console.error('Error in deleteCategoryAction:', error);
      dispatch(stopLoaderAction('deleteCategory'));
      return false;
    }
  };
};
