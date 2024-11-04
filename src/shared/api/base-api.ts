// src/shared/base-api.ts

import fetch from 'isomorphic-fetch';

import { apiUrl } from '../constants';

// Define a type for request options
// interface RequestOptions extends RequestInit {
//   body?: string;
//   headers?: Record<string, string>;
// }

// Default options for making API requests
const defaultOptions: any = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Note: Remove this line if not needed
  },
  credentials: 'include',
};

// Helper function to handle responses
const handleResponse = async (response: Response) => {
  if (response.status >= 400) {
    if (response.status === 401) {
      // Handle unauthorized response
      if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('user');
        const userName = localStorage.getItem('userName');

        localStorage.clear();
        localStorage.setItem('user', userId || '');
        localStorage.setItem('userName', userName || '');
        window.location.href = '/'; // Redirect to login or home page
      }
      
return;
    }
    

    throw new Error(`HTTP Error: ${response.status}`);
  }

  
return response.json();
};

// Function to make a request to the API
export async function makeRequest(uri: string, options: any = defaultOptions): Promise<any> {
  if (uri !== apiUrl.userLogin) {
    if (typeof window !== 'undefined') {
      options.headers = {
        ...options.headers,
        'x-tokens': localStorage.getItem('token') || '',
      };
    }

;
  }

  const requestUri = `${apiUrl.baseApiUrl}${uri}`;
  const response = await fetch(requestUri, { ...options });

  
return handleResponse(response);
}

// Function to make an Odoo-specific request
export async function makeOdooRequest(
  uri: string,
  options: any = defaultOptions,
  method: string = 'GET'
): Promise<any> {
  const requestOptions: any = {
    ...options,
    method,
  };

  const requestUri = `${apiUrl.baseOdooApiUrl}${uri}`;
  const response = await fetch(requestUri, requestOptions);

  
return handleResponse(response);
}

// Function to make a POST request to the Odoo API
export async function makeOdooPostRequest(uri: string, data: any): Promise<any> {
  const requestOptions: any = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const requestUri = `${apiUrl.baseOdooApiUrl}${uri}`;
  const response = await fetch(requestUri, requestOptions);

  
return handleResponse(response);
}









// Function to make an Odoo-specific GET request
export async function doOdooGetRequest(uri: string, options: any = defaultOptions): Promise<any> {
  options.method = 'GET';
  delete options.body;
  
return makeOdooRequest(uri, options);
}





// Function to make a GET request to the API
export async function doGetRequest(uri: string, options: any = defaultOptions): Promise<any> {
  options.method = 'GET';
  delete options.body;
  
return makeRequest(uri, options);
}





// Function to make an Odoo-specific POST request
export async function doOdooPostRequest(uri: string, data: any, options: any = defaultOptions): Promise<any> {
  options.method = 'POST';
  options.body = JSON.stringify(data);
  
return makeOdooPostRequest(uri, data);
}



// Function to make a POST request to the API
export async function doPostRequest(uri: string, data: any, options: any = defaultOptions): Promise<any> {
  options.method = 'POST';

  if (uri === apiUrl.userLogin) {
    options.headers = {
      ...options.headers,
      Authorization: 'Basic ' + btoa(`${data.userId}:${data.userPwd}`),
    };
    options.body = '';
  } else {
    options.body = JSON.stringify(data);
  }

  
return makeRequest(uri, options);
}






// Function to make a DELETE request to the API
export async function doDeleteRequest(uri: string, data: any, options: any = defaultOptions): Promise<any> {
  options.method = 'DELETE';
  options.body = JSON.stringify(data);
  
return makeRequest(uri, options);
}



// Function to make a PUT request to the API
export async function doPutRequest(uri: string, data: any, options: any = defaultOptions): Promise<any> {
  options.method = 'PUT';
  options.body = JSON.stringify(data);
  
return makeRequest(uri, options);
}
