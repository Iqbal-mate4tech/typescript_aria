'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { Card, CardContent, Button, TextField, Typography, Checkbox, Grid, TextareaAutosize, CircularProgress, Box } from '@mui/material';
import { useSelector } from 'react-redux';

import {
  palletsAction, palletItemsAction, unmountPalletsAction,
  clearPalletsAction, clearFormData, updatePalletFormData, savePalletAction
} from '../pallet/action';
import { palletBookingMasterDataAction, updatePalletShippingStatusAction, palletByStatusAction } from './action';
import { type RootState, useAppDispatch } from '../../store';
import AppHeader from '@components/app-header';
import { AppAlert } from '@components/app-alert';
import SingleSelect from '@components/single-select';
import { webUrl } from '../../../shared/constants';
import { hasPermission } from '../../../shared/common';
import useAuth from '@components/withAuth';


// interface Pallet {
//   id: number;
//   store_name: string;
//   status: string;
//   freight_company: string;
//   Contents: string;
//   wrapped_by: string;
//   pallet_type: string;
//   weight: number;
//   wrapped_date: string;
// }

// interface FormData {
//   shipper: string;
//   palletIds?: any[];
//   searchStore?: any[];
//   chep?: number;
//   loscam?: number;
//   plain?: number;
//   total?: number;
//   weight?: number;
// }


const PalletBooking: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAuth();



  const [detailsToShowIndex, setDetailsToShowIndex] = useState<any>(undefined);
  const [itemDetailsToShowIndex, setItemDetailsToShowIndex] = useState<any>(undefined);
  const [pageNo, setPageNo] = useState<any>(1);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showNoMoreData, setShowNoMoreData] = useState<boolean>(false);
  const [userName, setUserName] = useState<any>(null);

  const {
    palletShipper,
    palletStore,
    pallets,
    palletItems,
    formData
  } = useSelector((state: RootState) => ({
    palletShipper: state.pallet.palletShipper,
    palletStore: state.pallet.palletStore,
    pallets: state.pallet.pallets,
    palletItems: state.pallet.palletItems,
    formData: state.pallet.formData,
  }));




  useEffect(() => {
    // Check if running on the client to access `localStorage`
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('userName') || '';

      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    // if (isAuthenticated) {
    dispatch(palletBookingMasterDataAction());
    dispatch(clearFormData({ palletIds: [] }));
    getPallets();

    // }


    return () => {
      dispatch(unmountPalletsAction());
    };
  }, []);

  const getPallets = (e?: any) => {

    getPalletData(pageNo);
  }

  const onFieldChange = (name: any, value: any) => {

    dispatch(updatePalletFormData({ [name]: value }));
  }

  //   const getPalletData = useCallback(async (page: number) => {
  //     if (isLoading || !hasMore) return;

  //     setIsLoading(true);

  //     const request = {
  //       page,
  //       status: 'Wrapped|On Hold|Request To Hold|Request To Dispatch',
  //       ...(formData?.searchStore && { store_id: formData.searchStore })
  //     };

  //     const response = await dispatch(palletByStatusAction(request));

  //     if (response && response[0]?.length === 0) {
  //       setHasMore(false);
  //       setShowNoMoreData(true);
  //     } else {
  //       setPageNo(prevPageNo => prevPageNo + 1);
  //     }

  //     setIsLoading(false);
  //   }, [dispatch, formData, isLoading, hasMore]);

  //   useEffect(() => {
  //     const handleScroll = () => {
  //       if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50) && hasMore && !isLoading) {
  //         getPalletData(pageNo);
  //       }
  //     };

  //     window.addEventListener('scroll', handleScroll);

  // return () => window.removeEventListener('scroll', handleScroll);
  //   }, [pageNo, hasMore, isLoading, getPalletData]);

  //   const onFieldChange = (name: string, value: any) => {
  //     dispatch(updatePalletFormData({ [name]: value }));
  //   };

  const getPalletData = (page = 1, event?: any) => {

    const request: any = { page: page };

    request.status = 'Wrapped|On Hold|Request To Hold|Request To Dispatch';

    if (formData && formData.searchStore)
      request.store_id = formData.searchStore;

    dispatch(palletByStatusAction(request)).then(() => {

      event && event.target.complete();
    });;

    setPageNo(page + 1);
  }

  const onSearchClick = () => {
    setPageNo(1);
    setHasMore(true);
    setShowNoMoreData(false);
    dispatch(clearPalletsAction());
    setDetailsToShowIndex(undefined)
    setItemDetailsToShowIndex(undefined);
    getPalletData(1);
  };

  const onClearClick = () => {
    dispatch(clearPalletsAction());
    setDetailsToShowIndex(undefined);
    setItemDetailsToShowIndex(undefined);
    setPageNo(1);
    setHasMore(true);
    setShowNoMoreData(false);
    dispatch(clearFormData({ palletIds: [] }));
  };

  const onRowClick = (index: number, id: any) => {
    if (index === detailsToShowIndex) {
      setDetailsToShowIndex(undefined);
    } else {
      dispatch(palletItemsAction(id)).then(() => {
        setDetailsToShowIndex(index);
      });
    }

    setItemDetailsToShowIndex(undefined);
  };

  const onItemRowClick = (index: number) => {
    index === itemDetailsToShowIndex ? setItemDetailsToShowIndex(undefined) : setItemDetailsToShowIndex(index);
  };

  const onBookClick = () => {
    if (!formData || !formData.shipper || !formData.palletIds || formData.palletIds.length <= 0) {
      setAlertMessage('Please select shipper and pallet to book');
      setShowAlert(true);

      return;
    }

    const request: any = {
      id: formData.palletIds.join(','),
      shipper: formData.shipper,
      status: 'Booked',
      user: userName,
    };

    dispatch(updatePalletShippingStatusAction(request)).then((response: any) => {
      setAlertMessage(response ? 'Booked successfully!' : 'Booking failed!');
      setShowAlert(true);

      const palletData = {
        id: request.id,
        shipper: request.shipper,        // Shipper's name
        status: request.status,
        last_status_changed_by: request.user
      };

      dispatch(savePalletAction(palletData))
        .then(() => {
          console.log('Pallet data sent to Odoo successfully');
        })
        .catch((error) => {
          console.error('Error sending pallet data to Odoo:', error);
        });

      if (response) {
        setItemDetailsToShowIndex(undefined);
        setDetailsToShowIndex(undefined);
        dispatch(clearPalletsAction());
        onSearchClick();
        dispatch(clearFormData({ palletIds: [], searchStore: request.store_id }));
        dispatch(updatePalletFormData({ callApi: true }));
      }
    });
  };

  const onPalletChecked = (pallet: any, checked: boolean) => {
    if (formData && formData.palletIds) {
      let _palletIds = [...formData.palletIds];
      let total = 0;
      const typeToUpdate: any = {};

      const isAlreadyChecked = _palletIds.includes(pallet.id);

      if (checked && isAlreadyChecked) {
        alert('This pallet is already selected. It will now be unselected.');
        _palletIds = _palletIds.filter((id) => id !== pallet.id);
        checked = false;
      } else if (checked && !isAlreadyChecked) {
        _palletIds.push(pallet.id);
      } else if (!checked && isAlreadyChecked) {
        _palletIds = _palletIds.filter((id) => id !== pallet.id);
      }

      typeToUpdate.palletIds = _palletIds;

      if (pallet.pallet_type) {
        const palletType = pallet.pallet_type.toLowerCase();

        switch (palletType) {
          case 'chep':
            typeToUpdate.chep = checked
              ? (formData.chep ? formData.chep + 1 : 1)
              : (formData.chep ? formData.chep - 1 : 0);
            total += checked ? 1 : -1;
            break;
          case 'loscam':
            typeToUpdate.loscam = checked
              ? (formData.loscam ? formData.loscam + 1 : 1)
              : (formData.loscam ? formData.loscam - 1 : 0);
            total += checked ? 1 : -1;
            break;
          case 'plain':
            typeToUpdate.plain = checked
              ? (formData.plain ? formData.plain + 1 : 1)
              : (formData.plain ? formData.plain - 1 : 0);
            total += checked ? 1 : -1;
            break;
          default:
            break;
        }

        typeToUpdate.total = formData.total ? formData.total + total : total;
      }

      if (pallet.weight && !isNaN(pallet.weight)) {
        typeToUpdate.weight = checked
          ? formData.weight
            ? formData.weight + parseInt(pallet.weight)
            : parseInt(pallet.weight)
          : formData.weight
            ? formData.weight - parseInt(pallet.weight)
            : 0;
      }

      dispatch(updatePalletFormData(typeToUpdate));
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const palletItemsData = () => {
    return palletItems && palletItems.length > 0 ? (
      palletItems.map((value: any, index: number) => (
        <Card
          key={index}
          onClick={(e) => { e.stopPropagation(); onItemRowClick(index); }}
          className="mb-2 bg-gray-100 cursor-pointer"
          sx={{ cursor: 'pointer', mb: 2 }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="subtitle2" className="font-bold text-gray-700">{value.barcode}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" className="text-gray-700">Qty: <strong>{value.quantity}</strong></Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" className="font-bold text-gray-700">{value.description}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" className="text-gray-700">DID No: <strong>{value.ito}</strong></Typography>
              </Grid>
              {index === itemDetailsToShowIndex && (
                <>
                  <Grid item xs={12}><Typography variant="body2" className="text-gray-700">Item ID: <strong>{value.id}</strong></Typography></Grid>
                  <Grid item xs={12}><Typography variant="body2" className="text-gray-700">Outer: <strong>{value.outer}</strong></Typography></Grid>
                  <Grid item xs={12}><Typography variant="body2" className="text-gray-700">Inner: <strong>{value.inner}</strong></Typography></Grid>
                  <Grid item xs={12}><Typography variant="body2" className="text-gray-700">Received: <strong>{value.received_count}</strong></Typography></Grid>
                  <Grid item xs={12}><Typography variant="body2" className="text-gray-700">Added by: <strong>{value.added_by}</strong></Typography></Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      ))
    ) : (
      <Card className="bg-red-100"><CardContent>No records found</CardContent></Card>
    );
  };

  const palletData = () => {
    return pallets && Array.isArray(pallets) && pallets[0] && Array.isArray(pallets[0]) && pallets[0].length > 0 ? (
      pallets[0].map((value: any, index: number) => (
        <Card
          key={index}
          onClick={() => onRowClick(index, value.id)}
          className="mb-4 cursor-pointer"
          sx={{ cursor: 'pointer', mb: 4 }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={2}>
                <Typography variant="h6" className="font-bold text-gray-800">{value.id}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" className="text-gray-700">{value.store_name}</Typography>
                <Typography variant="body2" className="text-gray-700">{value.status}</Typography>
                <Typography variant="body2" className="text-gray-700">{value.freight_company}</Typography>
                <Typography variant="body2" className="text-gray-700">{value.Contents}</Typography>
                <Typography variant="body2" className="text-gray-700">{value.wrapped_by}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Checkbox
                  checked={formData.palletIds.includes(value.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    onPalletChecked(value, e.target.checked);
                  }}
                />
              </Grid>
              {index === detailsToShowIndex && (
                <Grid item xs={12}>
                  <Typography variant="body2" className="text-gray-700">Category: <strong>{value.category}</strong></Typography>
                  <Typography variant="body2" className="text-gray-700">Pallet Type: <strong>{value.pallet_type}</strong></Typography>
                  <Typography variant="body2" className="text-gray-700">Weight: <strong>{value.weight}</strong></Typography>
                  <Typography variant="body2" className="text-gray-700">Contents: <strong>{value.Contents}</strong></Typography>
                  <Typography variant="body2" className="text-gray-700">Wrapped on: <strong>{value.wrapped_date}</strong></Typography>
                  <Card className="mt-4">
                    <CardContent>{palletItemsData()}</CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      ))
    ) : (
      <Card className="bg-red-100"><CardContent>No records found</CardContent></Card>
    );
  };



  return (
    <div className="p-8">
      <AppHeader
        headerText="Pallet Booking"
        redirectTo={(url: string) => router.push(url)}
        showAddPalletIcon={false}
        showBookingIcon={false}
        showDispatchIcon={hasPermission('Dispatch')}
      />
      <div className="mb-8">
        <Card className="mb-8 bg-white shadow-lg">
          <CardContent>
            <Grid container spacing={4} alignItems="center">
              <Grid item md={6} xs={12}>
                {/* <Typography variant="body2" className="font-bold text-gray-800">Store</Typography> */}
                <SingleSelect
                  name="searchStore"
                  options={palletStore}
                  optionValue="id"
                  optionName="store_name"
                  onChange={onFieldChange}
                  value={formData.searchStore || ''}
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <Button variant="contained" color="primary" size="large" style={{ padding: '15px 0' }} fullWidth
                  onClick={onSearchClick}>Search</Button>
              </Grid>
              <Grid item md={3} xs={6}>
                <Button variant="contained" color="success" size="large" style={{ padding: '15px 0' }} fullWidth
                  onClick={onClearClick}>Clear</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card className="mb-8">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={2} xs={6}>
                <Typography variant="body2" className="font-bold text-gray-800">Shippers</Typography>
                <SingleSelect
                  name="shipper"
                  options={palletShipper}
                  optionValue="shipper_name"
                  optionName="shipper_name"
                  onChange={onFieldChange}
                  value={formData.shipper || ''}
                />
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="body2" className="font-bold text-gray-800">Total Weight</Typography>
                <TextField variant="outlined" disabled value={formData.weight || ''} fullWidth />
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="body2" className="font-bold text-gray-800">Chep</Typography>
                <TextField variant="outlined" disabled value={formData.chep || ''} fullWidth />
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="body2" className="font-bold text-gray-800">Loscam</Typography>
                <TextField variant="outlined" disabled value={formData.loscam || ''} fullWidth />
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="body2" className="font-bold text-gray-800">Plain</Typography>
                <TextField variant="outlined" disabled value={formData.plain || ''} fullWidth />
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="body2" className="font-bold text-gray-800">Total</Typography>
                <TextField variant="outlined" disabled value={formData.total || ''} fullWidth />
              </Grid>
              <Grid item md={4} xs={6}>
                <Typography variant="body2" className="font-bold text-gray-800">Selected Pallets</Typography>
                <TextareaAutosize minRows={3} disabled value={formData.palletIds && formData.palletIds.join(', ')} className="w-full p-2 border cursor-not-allowed border-gray-300 rounded" />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ justifyContent: 'flex-end' }}>
              <Grid item md={3} xs={6}>
                <Button variant="contained" color="primary" size="large" style={{ padding: '15px 0', marginTop: '17px' }} fullWidth
                  onClick={onBookClick}>Book</Button>
              </Grid>
              <Grid item md={3} xs={6}>
                <Button variant="contained" color="primary" size="large" style={{ padding: '15px 0', marginTop: '17px' }} fullWidth
                  onClick={() => router.push(webUrl.pallet)}>Back</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
      <Card className="p-4 bg-white shadow-lg">
        {palletData()}
        {isLoading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
        {!hasMore && showNoMoreData && (
          <Box mt={2} textAlign="center">
            <Typography variant="body2" >No more data</Typography>
          </Box>
        )}
      </Card>
      <AppAlert showAlert={showAlert} headerText="Message" message={alertMessage} btnCancelText="OK" cancelClick={() => setShowAlert(false)} />
    </div>
  );
};

export default PalletBooking;
