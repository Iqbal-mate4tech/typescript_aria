import { useMemo } from 'react';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook} from 'react-redux';
import { useStore as useReduxStore, useDispatch, useSelector } from 'react-redux';

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



// import { useMemo } from 'react';

// import { ThunkAction } from 'redux-thunk';
// import { configureStore, combineReducers, Action } from '@reduxjs/toolkit'; // Correct import for ThunkAction and Action
// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'; // Correct import for react-redux

// // Import your reducers
// import userReducer from '@/app/(dashboard)/user_master/reducer';
// import palletReducer from '@/app/(dashboard)/pallet/reducer';
// import orderReducer from '@/app/(dashboard)/estore/reducer';
// import productReducer from '@/app/(dashboard)/product/reducer';
// import purchaseOrderReducer from '@/app/(dashboard)/purchase_order/reducer';
// import itotoggleReducer from '@/app/(dashboard)/receive_po_new/reducer';
// import receiveodooReducer from '@/app/(dashboard)/receive_po_odoo/reducer';
// import scanpoReducer from '@/app/(dashboard)/new_pallets/reducer';

// // Combine all reducers into a rootReducer
// const rootReducer = combineReducers({
//   user: userReducer,
//   pallet: palletReducer,
//   order: orderReducer,
//   product: productReducer,
//   purchaseOrder: purchaseOrderReducer,
//   itotoggle: itotoggleReducer,
//   receiveodoo: receiveodooReducer,
//   scanpo: scanpoReducer,
// });

// // Define RootState type based on the rootReducer
// export type RootState = ReturnType<typeof rootReducer>;

// // Define AppThunk type to support asynchronous actions (thunks)
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;

// // Initialize the store
// const initStore = (preloadedState?: Partial<RootState>) => 
//   configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Thunks are automatically included
//     devTools: process.env.NODE_ENV !== 'production',
//   });

// // Custom hook to initialize the store with memoization
// export const useStore = (initialState?: Partial<RootState>) => 
//   useMemo(() => initStore(initialState), [initialState]);

// // TypeScript types for your Redux setup
// export type AppStore = ReturnType<typeof initStore>;
// export type AppDispatch = AppStore['dispatch'];

// // Custom hooks to use throughout your app
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
