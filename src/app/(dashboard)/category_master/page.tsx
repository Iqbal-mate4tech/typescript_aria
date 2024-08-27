// // Dependencies
// "use client"
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/app/store';
// import { IconButton, Card, CardContent, Typography, Grid } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import  AppHeader  from '@/components/app-header';
// import { MasterModal } from '@/components/master-modal';
// import { AppAlert } from '@/components/app-alert';
// import { palletCategoryAction } from '../pallet/action';
// import { deleteCategoryAction, addUpdateCategoryAction } from '../../action';

// // TypeScript types (define the types for your state and actions here)
// interface Category {
//   category_id: number;
//   category_name: string;
// }

// // Component
// const CategoryMaster: React.FC = () => {
//   const [id, setId] = useState<number | undefined>(undefined);
//   const [name, setName] = useState<string>('');
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [showAlert, setShowAlert] = useState<boolean>(false);
//   const [alertMessage, setAlertMessage] = useState<string>('');
//   const [showConfirm, setShowConfirm] = useState<boolean>(false);

//   const dispatch = useDispatch();
//   const router = useRouter();
//   const category = useSelector((state: RootState) => state.pallet.palletCategory);

//   useEffect(() => {
//     dispatch(palletCategoryAction());
//   }, [dispatch]);

//   const onAddClick = () => {
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setId(undefined);
//     setName('');
//     setShowAlert(false);
//     setShowConfirm(false);
//   };

//   const onDoneClick = () => {
//     const request = { category_name: name };
//     if (id) {
//       request['category_id'] = id;
//     }

//     dispatch(addUpdateCategoryAction(request)).then((response: boolean) => {
//       if (response) {
//         closeModal();
//         dispatch(palletCategoryAction());
//       } else {
//         setAlertMessage('Save failed.');
//         setShowAlert(true);
//       }
//     });
//   };

//   const onDeleteClick = () => {
//     dispatch(deleteCategoryAction(id)).then((response: boolean) => {
//       if (response) {
//         closeModal();
//         dispatch(palletCategoryAction());
//       } else {
//         setAlertMessage('Deletion failed.');
//         setShowAlert(true);
//       }
//     });
//   };

//   const cards = () => (
//     category && Array.isArray(category) ? (
//       category.map((value: Category, index: number) => (
//         <Card key={index} className="mb-4">
//           <CardContent>
//             <Grid container alignItems="center" spacing={2}>
//               <Grid item xs={10}>
//                 <Typography variant="h6">
//                   <strong>{value.category_id}</strong>
//                 </Typography>
//                 <Typography variant="body2">
//                   Name: <strong>{value.category_name}</strong>
//                 </Typography>
//               </Grid>
//               <Grid item xs={2} className="text-right">
//                 <IconButton
//                   color="error"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setShowConfirm(true);
//                     setAlertMessage('Are you sure you want to delete?');
//                     setId(value.category_id);
//                   }}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//                 <IconButton
//                   color="primary"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setShowModal(true);
//                     setId(value.category_id);
//                     setName(value.category_name);
//                   }}
//                 >
//                   <EditIcon />
//                 </IconButton>
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>
//       ))
//     ) : (
//       <Card>
//         <CardContent>No record found</CardContent>
//       </Card>
//     )
//   );

//   return (
//     <div>
//       <AppHeader
//         headerText="Category Master"
//         showAdd={true}
//         onAddClick={onAddClick}
//         redirectTo={(url: string) => router.push(url)}
//       />
//       <div className="p-4">
//         <div className="bg-white shadow rounded-lg p-6">{cards()}</div>
//       </div>
//       <MasterModal
//         name={name}
//         setName={setName}
//         id={id}
//         showModal={showModal}
//         onDoneClick={onDoneClick}
//         closeModal={closeModal}
//       />
//       <AppAlert
//         showAlert={showConfirm}
//         headerText="Confirm"
//         message={alertMessage}
//         btnCancelText="Cancel"
//         btnOkText="Yes"
//         okClick={onDeleteClick}
//         cancelClick={() => {
//           setShowConfirm(false);
//           setId(0);
//         }}
//       />
//       <AppAlert
//         showAlert={showAlert}
//         headerText="Message"
//         message={alertMessage}
//         btnCancelText="OK"
//         cancelClick={() => setShowAlert(false)}
//       />
//     </div>
//   );
// };

// export default CategoryMaster;

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, IconButton, Typography, Tooltip, Snackbar, Alert, Container, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import useAuth from '@/components/withAuth';
import  AppHeader  from '@/components/app-header';
import  MasterModal  from '@/components/master-modal';
import { AppAlert } from '@/components/app-alert';
import { palletCategoryAction } from '../pallet/action';
import { deleteCategoryAction, addUpdateCategoryAction } from '../../action';


const CategoryMaster: React.FC = () => {
  const isAuthenticated = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const category = useSelector((state: RootState) => state.pallet.palletCategory);

  const [id, setId] = useState<number | undefined>(undefined);
  const [name, setName] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [flashMessage, setFlashMessage] = useState<string>('');
  const [flashSeverity, setFlashSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(palletCategoryAction());
    }
  }, [isAuthenticated, dispatch]);

  const onAddClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setId(undefined);
    setName('');
  };

  const onDoneClick = async () => {
    const request = { category_name: name };
    if (id) request.category_id = id;

    const response = await dispatch(addUpdateCategoryAction(request));
    if (response) {
      closeModal();
      dispatch(palletCategoryAction());
      showFlashMessage('Category saved successfully!', 'success');
    } else {
      setAlertMessage('Save failed.');
      setShowAlert(true);
    }
  };

  const onDeleteClick = async () => {
    const response = await dispatch(deleteCategoryAction(id));
    if (response) {
      setShowConfirm(false);
      dispatch(palletCategoryAction());
      showFlashMessage('Category deleted successfully!', 'success');
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

  const renderCards = () => {
    return category && Array.isArray(category) ? (
      category.map((value: any, index: number) => (
        <Card key={index} className="mb-4">
          <CardContent>
            <Grid container alignItems="center">
              <Grid item xs={8}>
                <Typography variant="h6">Name: <strong>{value.category_name}</strong></Typography>
                <Typography variant="body2">ID: <strong>{value.category_id}</strong></Typography>
              </Grid>
              <Grid item xs={4} container justifyContent="flex-end">
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setShowModal(true);
                      setId(value.category_id);
                      setName(value.category_name);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => {
                      setShowConfirm(true);
                      setAlertMessage('Are you sure you want to delete?');
                      setId(value.category_id);
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

  if (!isAuthenticated) return null; // Prevent rendering if not authenticated

  return (
    <Container>
      <AppHeader
        headerText="Category Master"
        showAdd={true}
        onAddClick={onAddClick}
        redirectTo={(url: string) => router.push(url)}
      />
      <Box mt={2}>
        {renderCards()}
      </Box>
      <MasterModal
        name={name}
        setName={setName}
        id={id}
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
        okClick={onDeleteClick} // Delete and close the dialog
        cancelClick={() => setShowConfirm(false)}
      />
      <AppAlert
        showAlert={showAlert}
        headerText="Message"
        message={alertMessage}
        btnCancelText="OK"
        cancelClick={() => setShowAlert(false)}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={flashSeverity}>
          {flashMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoryMaster;
