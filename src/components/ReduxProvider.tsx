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


