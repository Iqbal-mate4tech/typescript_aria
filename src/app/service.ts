import { doGetRequest, doPostRequest } from '../shared/api/base-api';
import { apiUrl } from '../shared/constants';
import { stringformat } from '../shared/common';

// Define TypeScript types for the data being sent to the APIs
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

// Shipper Service
export function addUpdateShipper(data: ShipperData) {
  return doPostRequest(apiUrl.addUpdateShipper, data);
}

export function deleteShipper(id: number) {
  return doGetRequest(stringformat(apiUrl.deleteShipper, [id]));
}

// Pallet Type Service
export function addUpdatePalletType(data: PalletTypeData) {
  return doPostRequest(apiUrl.addUpdatePalletType, data);
}

export function deletePalletType(id: number) {
  return doGetRequest(stringformat(apiUrl.deletePalletType, [id]));
}

// User Service
export function addUpdateUsers(data: UserData) {
  return doPostRequest(apiUrl.addUpdateUsers, data);
}

export function deleteUser(id: number) {
  return doGetRequest(stringformat(apiUrl.deleteUser, [id]));
}

// Category Service
export function addUpdateCategory(data: CategoryData) {
  return doPostRequest(apiUrl.addUpdateCategory, data);
}

export function deleteCategory(id: number) {
  return doGetRequest(stringformat(apiUrl.deleteCategory, [id]));
}
