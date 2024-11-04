import { doPostRequest, doGetRequest } from '../../../shared/api/base-api';
import { apiUrl } from '../../../shared/constants';

// Define types for the request payloads and responses
// interface LoginData {
//   userId: string;
//   userPwd: string;
// }

// Function to log in a user
export function userLogin(data: any): Promise<any> {
  return doPostRequest(apiUrl.userLogin, data);
}

// Function to log out the user
export function logout(): Promise<any> {
  return doGetRequest(apiUrl.userLogout);
}

// Function to get all users
export function appUsers(): Promise<any> {
  return doGetRequest(apiUrl.appUsers);
}

// Function to get all user types
export function appUserType(): Promise<any> {
  return doGetRequest(apiUrl.getUserType);
}

