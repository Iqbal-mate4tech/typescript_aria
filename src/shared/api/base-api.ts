import fetch from 'isomorphic-fetch';

import { apiUrl } from '../constants';

// Define types for the default options
interface RequestOptions extends RequestInit {
  headers: Record<string, string>;
  body?: string | null;
  method?: string;
}

// Immutable default options
const defaultOptions: RequestOptions = {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Can be removed if not needed
    'Access-Control-Allow-Credentials':'true',
  },
  credentials: 'include', // Ensures cookies and other credentials are included
};

// Function to make a request to the API
export async function makeRequest<T = any>(uri: string, options: Partial<RequestOptions> = {}): Promise<T> {
  try {
    // Ensure headers are always initialized
    const requestOptions: RequestOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {}), // Ensure headers are never undefined
      },
    };

    if (uri !== apiUrl.userLogin) {
      requestOptions.headers['x-tokens'] = localStorage.getItem('token') || '';
    }

    const response = await fetch(`${apiUrl.baseApiUrl}${uri}`, requestOptions);

    console.log(response);

    if (response.status >= 400) {
      if (response.status === 401) {
        const userId = localStorage.getItem('user');
        const userName = localStorage.getItem('userName');

        localStorage.clear();
        localStorage.setItem('user', userId || '');
        localStorage.setItem('userName', userName || '');
        window.location.href = '/';
      }

      const errorText = await response.text();

      throw new Error(`API Error: ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Function to make a GET request to the Odoo API
export async function makeOdooRequest<T = any>(uri: string, method: string = 'GET', options: Partial<RequestOptions> = {}): Promise<T> {
  try {
    const requestOptions: RequestOptions = {
      ...defaultOptions,
      ...options,
      method,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {}), // Ensure headers are never undefined
      },
      redirect: 'follow',
    };

    const response = await fetch(`${apiUrl.baseOdooApiUrl}${uri}`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Odoo API Error: ${response.statusText} - ${errorText}`);
    }

    
return response.json();
  } catch (error) {
    console.error('Odoo API Request Error:', error);
    throw error;
  }
}

// Function to make a POST request to the Odoo API
export async function makeOdooPostRequest<T = any>(uri: string, data: any): Promise<T> {
  try {
    const requestOptions: RequestOptions = {
      method: 'POST',
      body: JSON.stringify(data),
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${apiUrl.baseOdooApiUrl}${uri}`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Odoo POST API Error: ${response.statusText} - ${errorText}`);
    }

    
return response.json();
  } catch (error) {
    console.error('Odoo POST Request Error:', error);
    throw error;
  }
}

// Function to make a GET request
export function doGetRequest<T = any>(uri: string, options: Partial<RequestOptions> = {}): Promise<T> {
  return makeRequest(uri, { ...options, method: 'GET', body: null });
}

// Function to make a POST request
export function doPostRequest<T = any>(uri: string, data: any, options: Partial<RequestOptions> = {}): Promise<T> {
  const postOptions: RequestOptions = {
    ...options,
    method: 'POST',
    headers: {
      ...(options.headers || {}), // Ensure headers are never undefined
    },
  };

  if (uri === apiUrl.userLogin) {
    postOptions.headers['Authorization'] = 'Basic ' + btoa(`${data.userId}:${data.userPwd}`);
    postOptions.body = null;
  } else {
    postOptions.body = JSON.stringify(data);
  }

  return makeRequest(uri, postOptions);
}

// Function to make a DELETE request
export function doDeleteRequest<T = any>(uri: string, data: any, options: Partial<RequestOptions> = {}): Promise<T> {
  return makeRequest(uri, {
    ...options,
    method: 'DELETE',
    body: JSON.stringify(data),
    headers: {
      ...(options.headers || {}), // Ensure headers are never undefined
    },
  });
}

// Function to make a PUT request
export function doPutRequest<T = any>(uri: string, data: any, options: Partial<RequestOptions> = {}): Promise<T> {
  return makeRequest(uri, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      ...(options.headers || {}), // Ensure headers are never undefined
    },
  });
}

// Function to make a GET request to the Odoo API
export function doOdooGetRequest<T = any>(uri: string, options: Partial<RequestOptions> = {}): Promise<T> {
  return makeOdooRequest(uri, 'GET', { ...options, body: null });
}

// Function to make a POST request to the Odoo API
export function doOdooPostRequest<T = any>(uri: string, data: any, options: Partial<RequestOptions> = {}): Promise<T> {
  return makeOdooPostRequest(uri, data);
}
