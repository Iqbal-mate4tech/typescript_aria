import { createBrowserHistory } from 'history';

export const history = typeof window !== 'undefined' ? createBrowserHistory() : null;


