'use client';

import type { ReactNode } from 'react';

import { Provider } from 'react-redux';

import { useStore } from '../app/store';

interface ReduxProviderProps {
  children: ReactNode;
  initialState?: any;
  initialProps?: any;
}

const ReduxProvider = ({ children, initialState, initialProps }: ReduxProviderProps) => {
  const store = useStore(initialState);

  
return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;


// 'use client';

// import type { ReactNode } from 'react';

// import { Provider } from 'react-redux';

// import { useStore } from '@/app/store';
// import type { RootState } from '@/app/store'; // Ensure RootState is imported from your store definition

// interface ReduxProviderProps {
//   children: ReactNode;
//   initialState?: Partial<RootState>; // Use Partial<RootState> for the initial state
//   initialProps?: any; // Keep initialProps for now in case you use them
// }

// const ReduxProvider = ({ children, initialState, initialProps }: ReduxProviderProps) => {
//   const store = useStore(initialState); // Initialize the store with preloaded state if available

//   return <Provider store={store}>{children}</Provider>;
// };

// export default ReduxProvider;



