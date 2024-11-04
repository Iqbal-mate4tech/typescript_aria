
// src/container/user/action.ts


import { userLogin, appUsers, appUserType } from './service';
import { AppDispatch } from '../../store';

/**
 * Action types
 */
export const actionTypes = {
  USER_LOGIN_REQUEST: 'USER_LOGIN_REQUEST',
  USER_LOGIN_REQUEST_SUCCESS: 'USER_LOGIN_REQUEST_SUCCESS',
  SHOW_LOADER: 'SHOW_LOADER',
  STOP_LOADER: 'STOP_LOADER',
  UNMOUNT_USER: 'UNMOUNT_USER',
  USERS_RECEIVED: 'USERS_RECEIVED',
  USER_TYPE_RECEIVED: 'USER_TYPE_RECEIVED',
} ;

interface Action {
  type: any;
  payload?: any;
}

// Action creators with TypeScript annotations
export const requestUserLoginAction = ():Action => ({
  type: actionTypes.USER_LOGIN_REQUEST,
});

export const receivedUserLoginAction = (payload: any):Action => ({
  type: actionTypes.USER_LOGIN_REQUEST_SUCCESS,
  payload,
});

export const showLoaderAction = (payload: any):Action => ({
  type: actionTypes.SHOW_LOADER,
  payload,
});

export const stopLoaderAction = (payload: any):Action => ({
  type: actionTypes.STOP_LOADER,
  payload,
});

// Thunk action for user login
export const userLoginAction = (userData:any) => {
  return async (dispatch: AppDispatch) => {
    dispatch(showLoaderAction('userLogin'));

    try {
      const response = await userLogin(userData);

      dispatch(stopLoaderAction('userLogin'));

      if (response && response[0] && response[0].token) {
        if (typeof window !== 'undefined') {
        localStorage.setItem('user', userData.userId);
        localStorage.setItem('userName', userData.userName);
        localStorage.setItem('token', response[0].token);
        localStorage.setItem('isAdmin', response[1].isAdmin.toString());
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', response[2].user_type);
        localStorage.setItem('store', response[3].store_access_id);
        }
        
return true;
      } else {
        return false;
      }
    } catch (error) {
      dispatch(stopLoaderAction('userLogin'));
      
return false;
    }
  };
};

export const unmountUserAction = ():Action => ({
  type: actionTypes.UNMOUNT_USER,
});

export const receivedUserAction = (payload: any):Action=> ({
  type: actionTypes.USERS_RECEIVED,
  payload,
});

// Thunk action to fetch users
export const usersAction = () => {
  return async (dispatch: any) => {
    dispatch(showLoaderAction('appUsers'));

    try {
      const response = await appUsers();

      dispatch(stopLoaderAction('appUsers'));
      dispatch(receivedUserAction(response));
    } catch (error) {
      dispatch(stopLoaderAction('appUsers'));
    }
  };
};

export const receivedUserTypeAction = (payload: any):Action => ({
  type: actionTypes.USER_TYPE_RECEIVED,
  payload,
});

// Thunk action to fetch user types
export const userTypeAction = () => {
  return async (dispatch: any) => {
    dispatch(showLoaderAction('appUserType'));

    try {
      const response = await appUserType();

      dispatch(stopLoaderAction('appUserType'));
      dispatch(receivedUserTypeAction(response));
    } catch (error) {
      dispatch(stopLoaderAction('appUserType'));
    }
  };
};
