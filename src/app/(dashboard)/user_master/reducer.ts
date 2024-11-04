

// src/container/user/reducer.ts

import { actionTypes } from './action';

/** TypeScript types for the state */
// interface UserState {
//   loading: boolean;
//   data: any[];
//   error: string | null;
//   showLoader: string[];
//   users?: any;
//   userTypes?: any;
// }

/** Initial state */
const initialState: any = {
  loading: false,
  data: [],
  error: null,
  showLoader: [],
};

/** TypeScript type for actions */
interface AppAction {
  type: string;
  payload?: any;
}

/** Reducer function */
const userReducer = (state = initialState, action: AppAction) => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.USER_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.SHOW_LOADER:
      return {
        ...state,
        showLoader: [...state.showLoader, payload],
      };

    case actionTypes.STOP_LOADER:
      return {
        ...state,
        showLoader: state.showLoader.filter((value:any) => value !== payload),
      };

    case actionTypes.UNMOUNT_USER:
      return {
        ...initialState,
      };

    case actionTypes.USERS_RECEIVED:
      return {
        ...state,
        users: payload,
      };

    case actionTypes.USER_TYPE_RECEIVED:
      return {
        ...state,
        userTypes: payload,
      };

    default:
      return state;
  }
};

export default userReducer;
