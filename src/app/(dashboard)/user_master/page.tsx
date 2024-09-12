'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Button, TextField, IconButton, Alert } from '@mui/material';
import { useDispatch , connect } from 'react-redux';

import { userLoginAction, unmountUserAction } from './action';
import { messages, webUrl } from '../../../shared/constants';
import { initialiseAddToHomeService } from '@/components/add-to-home';
import type { RootState } from '../../store';

const SignIn: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    userId: '',
    userPwd: '',
    userName: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    const name = localStorage.getItem('userName');

    setUserData((prevData) => ({
      ...prevData,
      userId: user || '',
      userName: name || '',
    }));

    localStorage.clear();
    dispatch(unmountUserAction());
    initialiseAddToHomeService();
  }, [dispatch]);

  const onLogin = () => {
    if (userData.userId && userData.userPwd && userData.userName) {
      dispatch(userLoginAction(userData)).then((response: boolean) => {
        if (!response) {
          setErrorMessage('Please enter valid credentials.');
        } else {
          router.push(webUrl.pallet);
        }
      });
    } else {
      setErrorMessage(messages.requiredSignInField);
    }
  };

  const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const onFieldKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onLogin();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center mt-20 p-6 w-full max-w-md bg-white rounded-lg shadow-lg">
        <div
          className="w-full max-w-xs h-24 mb-4 bg-no-repeat bg-contain bg-center"
          style={{ backgroundImage: 'url(/assets/monty.png)' }}
        ></div>
        <div
          className="w-full max-w-xs h-12 mb-6 bg-no-repeat bg-contain bg-center"
          style={{ backgroundImage: 'url(/assets/header.jpg)' }}
        ></div>
        <h5 className="text-xl font-bold text-red-600 mb-2">ARIA Pallet Tracker</h5>
        <h5 className="text-lg font-bold text-gray-700 mb-6">Sign in to your account</h5>
        <div className="space-y-4 w-full">
          <TextField
            fullWidth
            placeholder="User Id"
            name="userId"
            value={userData.userId}
            onChange={onFieldChange}
            onKeyUp={onFieldKeyUp}
          />
          <TextField
            fullWidth
            type="password"
            placeholder="Password"
            name="userPwd"
            value={userData.userPwd}
            onChange={onFieldChange}
            onKeyUp={onFieldKeyUp}
          />
          <TextField
            fullWidth
            placeholder="User Name"
            name="userName"
            value={userData.userName}
            onChange={onFieldChange}
            onKeyUp={onFieldKeyUp}
          />
        </div>
        {errorMessage && (
          <Alert severity="error" className="mt-4 flex items-center">
            <IconButton className="mr-2">
              {errorMessage}
            </IconButton>
            
          </Alert>
        )}
        <Button
          variant="contained"
          color="primary"
          className="mt-6 w-full py-3 text-lg"
          onClick={onLogin}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.user,
});

const mapDispatchToProps = {
  userLogin: userLoginAction,
  unmountUser: unmountUserAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
