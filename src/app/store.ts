// import { configureStore, combineReducers, Action } from '@reduxjs/toolkit';
// import { ThunkAction } from 'redux-thunk';
// import { useMemo } from 'react';
// import { useStore as useReduxStore, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// import userReducer from './(dashboard)/user_master/reducer';
// import palletReducer from './(dashboard)/pallet/reducer';
// import orderReducer from './(dashboard)/estore/reducer';
// import productReducer from './(dashboard)/product/reducer';
// import purchaseOrderReducer from './(dashboard)/purchase_order/reducer';
// // import itotoggleReducer from './(dashboard)/receive-po-new/reducer';
// // import receiveodooReducer from './(dashboard)/receive-po-odoo/reducer';
// // import scanpoReducer from './(dashboard)/pallet-new/reducer';

// // Combine all reducers into a root reducer
// const rootReducer = combineReducers({
//   user: userReducer,
//   pallet: palletReducer,
//   order: orderReducer,
//   product: productReducer,
//   purchaseOrder: purchaseOrderReducer,
//   // itotoggle: itotoggleReducer,
//   // receiveodoo: receiveodooReducer,
//   // scanpo: scanpoReducer
//   // Add other reducers here
// });

// // Create and configure the Redux store
// const initStore = () =>
//   configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
//     devTools: process.env.NODE_ENV !== 'production',
//   });

// // Memoize the store initialization
// export const useStore = (initialState?: any) => {
//   return useMemo(() => initStore(), [initialState]);
// };

// // Define TypeScript types for the store, root state, and dispatch
// export type AppStore = ReturnType<typeof initStore>;
// export type RootState = ReturnType<typeof rootReducer>;
// export type AppDispatch = AppStore['dispatch'];

// // Define AppThunk type for typing async actions (thunks)
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;

// // Custom hooks for using Redux in the application
// export const useAppDispatch: () => AppDispatch = useDispatch;
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import { useMemo } from 'react';
// import { useStore as useReduxStore } from 'react-redux';

// // Reducer Imports
// import userReducer from '@/app/(dashboard)/user_master/reducer';
// import palletReducer from '@/app/(dashboard)/pallet/reducer';
// import orderReducer from '@/app/(dashboard)/estore/reducer';
// import productReducer from '@/app/(dashboard)/product/reducer';
// import purchaseOrderReducer from '@/app/(dashboard)/purchase_order/reducer';
// import itotoggleReducer from '@/app/(dashboard)/receive_po_new/reducer';
// import receiveodooReducer from '@/app/(dashboard)/receive_po_odoo/reducer';
// import scanpoReducer from '@/app/(dashboard)/new_pallets/reducer';

// const rootReducer = combineReducers({
//   user: userReducer,
//   pallet: palletReducer,
//   order: orderReducer,
//   product: productReducer,
//   purchaseOrder: purchaseOrderReducer,
//   itotoggle: itotoggleReducer,
//   receiveodoo: receiveodooReducer,
//   scanpo: scanpoReducer,
//   // Add other reducers here
// });

// const initStore = () =>
//   configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
//     devTools: process.env.NODE_ENV !== 'production',
//   });

// export const useStore = (initialState?: any) => {
//   return useMemo(() => initStore(initialState), [initialState]);
// };

// export type AppStore = ReturnType<typeof initStore>;
// export type RootState = ReturnType<typeof rootReducer>;
// export type AppDispatch = AppStore['dispatch'];

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useStore as useReduxStore, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import your reducers
import userReducer from '@/app/(dashboard)/user_master/reducer';
import palletReducer from '@/app/(dashboard)/pallet/reducer';
import orderReducer from '@/app/(dashboard)/estore/reducer';
import productReducer from '@/app/(dashboard)/product/reducer';
import purchaseOrderReducer from '@/app/(dashboard)/purchase_order/reducer';
import itotoggleReducer from '@/app/(dashboard)/receive_po_new/reducer';
import receiveodooReducer from '@/app/(dashboard)/receive_po_odoo/reducer';
import scanpoReducer from '@/app/(dashboard)/new_pallets/reducer';

// Combine all reducers into a rootReducer
const rootReducer = combineReducers({
  user: userReducer,
  pallet: palletReducer,
  order: orderReducer,
  product: productReducer,
  purchaseOrder: purchaseOrderReducer,
  itotoggle: itotoggleReducer,
  receiveodoo: receiveodooReducer,
  scanpo: scanpoReducer,
  // Add other reducers here
});

// Initialize the store
const initStore = () => 
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
  });

// Custom hook to initialize the store with memoization
export const useStore = (initialState?: RootState) => 
  useMemo(() => initStore(), [initialState]);

// TypeScript types for your Redux setup
export type AppStore = ReturnType<typeof initStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];

// Custom hooks to use throughout your app
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
