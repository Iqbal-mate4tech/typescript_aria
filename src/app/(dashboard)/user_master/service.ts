import { doPostRequest, doGetRequest } from '../../../shared/api/base-api';
import { apiUrl } from '../../../shared/constants';

// Define the structure of the data being sent to the userLogin function
interface UserLoginData {
    userId: string;
    userPwd: string;
}

// Login API
export function userLogin(data: UserLoginData): Promise<any> {
    return doPostRequest(apiUrl.userLogin, data);
}

// API call to logout the user
export function logout(): Promise<any> {
    return doGetRequest(apiUrl.userLogout);
}

// API call to get all users
export function appUsers(): Promise<any> {
    return doGetRequest(apiUrl.appUsers);
}

// API call to get all user types
export function appUserType(): Promise<any> {
    return doGetRequest(apiUrl.getUserType);
}
