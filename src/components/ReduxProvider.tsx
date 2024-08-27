'use client';

import { Provider } from 'react-redux';
import { ReactNode } from 'react';
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


