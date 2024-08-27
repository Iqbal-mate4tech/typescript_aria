import { actionTypes } from './action';

/** State Interface */
interface UserState {
    loading: boolean;
    data: any[]; // Replace `any[]` with a more specific type if known
    error: string | null;
    showLoader: string[];
    users?: any[]; // Replace `any[]` with a more specific type if known
    userTypes?: any[]; // Replace `any[]` with a more specific type if known
}

/** Initial state */
const initialState: UserState = {
    loading: false,
    data: [],
    error: null,
    showLoader: [],
};

/** Action Interfaces */
interface UserLoginRequestAction {
    type: typeof actionTypes.USER_LOGIN_REQUEST;
}

interface ShowLoaderAction {
    type: typeof actionTypes.SHOW_LOADER;
    payload: string;
}

interface StopLoaderAction {
    type: typeof actionTypes.STOP_LOADER;
    payload: string;
}

interface UnmountUserAction {
    type: typeof actionTypes.UNMOUNT_USER;
}

interface UsersReceivedAction {
    type: typeof actionTypes.USERS_RECEIVED;
    payload: any[]; // Replace `any[]` with the specific user type if known
}

interface UserTypeReceivedAction {
    type: typeof actionTypes.USER_TYPE_RECEIVED;
    payload: any[]; // Replace `any[]` with the specific user type if known
}

/** Combined Action Types */
type UserActionTypes =
    | UserLoginRequestAction
    | ShowLoaderAction
    | StopLoaderAction
    | UnmountUserAction
    | UsersReceivedAction
    | UserTypeReceivedAction;

/** Reducer */
export default (state = initialState, action: UserActionTypes): UserState => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case actionTypes.SHOW_LOADER:
            return {
                ...state,
                showLoader: [...state.showLoader, action.payload],
            };

        case actionTypes.STOP_LOADER:
            return {
                ...state,
                showLoader: state.showLoader.filter((value) => value !== action.payload),
            };

        case actionTypes.UNMOUNT_USER:
            return {
                ...initialState,
            };

        case actionTypes.USERS_RECEIVED:
            return {
                ...state,
                users: action.payload,
            };

        case actionTypes.USER_TYPE_RECEIVED:
            return {
                ...state,
                userTypes: action.payload,
            };

        default:
            return state;
    }
};
