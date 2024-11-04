"use client"
import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Card, CardContent, Grid, IconButton, Typography, Tooltip, Box, Container, Snackbar, Alert } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useSelector } from 'react-redux';

import AppHeader from '@components/app-header';
import UserMasterModal from '@components/user-modal';
import { AppAlert } from '@components/app-alert';
import { useAppDispatch, type RootState } from '../../store';

import { usersAction, userTypeAction } from '../user_master/action'; // Adjust paths as necessary
import { deleteUserAction, addUpdateUserAction } from '../../action'; // Adjust paths as necessary

import useAuth from '@components/withAuth';



const UserMaster: React.FC = () => {
  const isAuthenticated = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();


  const users = useSelector((state: RootState) => state.user.users);
  const types = useSelector((state: RootState) => state.user.userTypes);

  const [id, setId] = useState<any>(undefined);
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [store, setStore] = useState<string>('');
  const [admin, setAdmin] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [flashMessage, setFlashMessage] = useState<string>('');
  const [flashSeverity, setFlashSeverity] = useState<'success' | 'error'>('success');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    // if (isAuthenticated) {
    dispatch(usersAction());
    dispatch(userTypeAction());

    // }
  }, []);

  const onAddClick = () => setShowModal(true);

  const closeModal = () => {
    setShowModal(false);
    resetModal();
  };

  const resetModal = () => {
    setId(undefined);
    setName('');
    setPassword('');
    setType('');
    setStore('');
    setAdmin(false);
  };

  const setModal = (item: any) => {
    setId(item.id);
    setName(item.username);
    setPassword(item.password);
    setType(item.user_type);
    setStore(item.store_access_id);
    setAdmin(!!item.is_admin);
  };

  const onDoneClick = async () => {
    const request: any = {
      username: name,
      password: password,
      is_admin: admin ? 1 : 0,
      user_type: type,
      store_access_id: store,
    };

    if (id) {
      request.id = id;
    }

    const response = await dispatch(addUpdateUserAction(request));

    if (response) {
      closeModal();
      resetModal();
      dispatch(usersAction());
      showFlashMessage('Record saved successfully!', 'success');
    } else {
      setAlertMessage('Save failed.');
      setShowAlert(true);
    }
  };

  const onDeleteClick = async () => {
    const response = await dispatch(deleteUserAction(id));

    if (response) {
      setShowConfirm(false);
      closeModal();
      resetModal();
      dispatch(usersAction());
      showFlashMessage('Record deleted successfully!', 'success');
    } else {
      setAlertMessage('Deletion failed.');
      setShowAlert(true);
    }
  };

  const showFlashMessage = (message: string, severity: 'success' | 'error') => {
    setFlashMessage(message);
    setFlashSeverity(severity);
    setOpenSnackbar(true);
  };


  if (!isAuthenticated) return null; // Prevent rendering if not authenticated

  const renderCards = () => {
    return users && Array.isArray(users) ? (
      users.map((value: any, index: number) => (
        <Card key={index} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <Typography variant="h6">ID: {value.id}</Typography>
                <Typography variant="body1">
                  User Name: <strong>{value.username}</strong>
                </Typography>
                <Typography variant="body1">
                  Store: <strong>{value.store_access_id}</strong>
                </Typography>
                <Typography variant="body1">
                  User Type: <strong>{value.user_type}</strong>
                </Typography>
                <Typography variant="body1">
                  Admin: <strong>{value.is_admin ? 'Yes' : 'No'}</strong>
                </Typography>
              </Grid>
              <Grid item xs={4} container justifyContent="flex-end">
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setShowModal(true);
                      setModal(value);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setShowConfirm(true);
                      setAlertMessage('Are you sure you want to delete?');
                      setId(value.id);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))
    ) : (
      <Card>
        <CardContent>No records found</CardContent>
      </Card>
    );
  };



  return (
    <Container>
      <AppHeader
        headerText="User Master"
        showAdd={true}
        onAddClick={onAddClick}
        redirectTo={(url: string) => router.push(url)}
      />
      <Box mt={2}>
        {renderCards()}
      </Box>
      <UserMasterModal
        name={name}
        setName={setName}
        id={id}
        password={password}
        setPassword={setPassword}
        type={type}
        setType={setType}
        store={store}
        setStore={setStore}
        admin={admin}
        setAdmin={setAdmin}
        types={types}
        showModal={showModal}
        onDoneClick={onDoneClick}
        closeModal={closeModal}
      />
      <AppAlert
        showAlert={showConfirm}
        headerText="Confirm"
        message={alertMessage}
        btnCancelText="Cancel"
        btnOkText="Yes"
        okClick={onDeleteClick}
        cancelClick={() => { setShowConfirm(false); setId(0); }}
      />
      <AppAlert
        showAlert={showAlert}
        headerText="Message"
        message={alertMessage}
        btnCancelText="OK"
        cancelClick={() => setShowAlert(false)}
      />

      {/* Snackbar for Flash Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={flashSeverity} onClose={() => setOpenSnackbar(false)}>
          {flashMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserMaster;
