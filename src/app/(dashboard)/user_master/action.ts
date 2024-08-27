import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { userLogin, appUsers, appUserType } from './service';

// Define the structure of the user data
interface UserLoginData {
    userId: string;
    userPwd: string;
    userName: string;
}

// Define the structure of the responses if known (using `any` for simplicity)
type UserLoginResponse = any; // Replace with actual type if known
type AppUsersResponse = any; // Replace with actual type if known
type AppUserTypeResponse = any; // Replace with actual type if known

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
} as const;

// Action Interfaces
interface RequestUserLoginAction extends Action<typeof actionTypes.USER_LOGIN_REQUEST> {}
interface ReceivedHuntingAreaAction extends Action<typeof actionTypes.USER_LOGIN_REQUEST_SUCCESS> {
    payload: UserLoginResponse;
}
interface ShowLoaderAction extends Action<typeof actionTypes.SHOW_LOADER> {
    payload: string;
}
interface StopLoaderAction extends Action<typeof actionTypes.STOP_LOADER> {
    payload: string;
}
interface UnmountUserAction extends Action<typeof actionTypes.UNMOUNT_USER> {}
interface ReceivedUserAction extends Action<typeof actionTypes.USERS_RECEIVED> {
    payload: AppUsersResponse;
}
interface ReceivedUserTypeAction extends Action<typeof actionTypes.USER_TYPE_RECEIVED> {
    payload: AppUserTypeResponse;
}

// Union Type for All Actions
type UserActions =
    | RequestUserLoginAction
    | ReceivedHuntingAreaAction
    | ShowLoaderAction
    | StopLoaderAction
    | UnmountUserAction
    | ReceivedUserAction
    | ReceivedUserTypeAction;

export const requestUserLoginAction = (): RequestUserLoginAction => ({
    type: actionTypes.USER_LOGIN_REQUEST,
});

export const receivedHuntingAreaAction = (payload: UserLoginResponse): ReceivedHuntingAreaAction => ({
    type: actionTypes.USER_LOGIN_REQUEST_SUCCESS,
    payload,
});

export const showLoaderAction = (payload: string): ShowLoaderAction => ({
    type: actionTypes.SHOW_LOADER,
    payload,
});

export const stopLoaderAction = (payload: string): StopLoaderAction => ({
    type: actionTypes.STOP_LOADER,
    payload,
});

export const userLoginAction = (userData: UserLoginData): ThunkAction<Promise<boolean>, {}, {}, UserActions> => {
    return async (dispatch) => {
        dispatch(showLoaderAction('userLogin'));

        try {
            const response = await userLogin(userData);

            dispatch(stopLoaderAction('userLogin'));

            if (response && response[0] && response[0].token) {
                localStorage.setItem('user', userData.userId);
                localStorage.setItem('userName', userData.userName);
                localStorage.setItem('token', response[0].token);
                localStorage.setItem('isAdmin', response[1].isAdmin);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userType', response[2].user_type);
                localStorage.setItem('store', response[3].store_access_id);
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

export const unmountUserAction = (): UnmountUserAction => ({
    type: actionTypes.UNMOUNT_USER,
});

export const receivedUserAction = (payload: AppUsersResponse): ReceivedUserAction => ({
    type: actionTypes.USERS_RECEIVED,
    payload,
});

export const usersAction = (): ThunkAction<void, {}, {}, UserActions> => {
    return async (dispatch) => {
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

export const receivedUserTypeAction = (payload: AppUserTypeResponse): ReceivedUserTypeAction => ({
    type: actionTypes.USER_TYPE_RECEIVED,
    payload,
});

export const userTypeAction = (): ThunkAction<void, {}, {}, UserActions> => {
    return async (dispatch) => {
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
