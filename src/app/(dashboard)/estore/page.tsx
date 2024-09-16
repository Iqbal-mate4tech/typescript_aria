"use client"
import React, { useState, useEffect, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import {  useSelector } from 'react-redux';

import {
  Button, Typography, Box, Grid, Card, CardContent, Container, Snackbar, CircularProgress, TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

import Alert from '@mui/material/Alert';

import { webUrl } from '../../../shared/constants';
import useAuth from '@components/withAuth';
import AppHeader from '../../../components/app-header';
import { useAppDispatch, type RootState } from '../../store';
import {
  ordersAction, unmountOrderAction, clearOrderAction, ordersCostAction
} from './action';

const OrderReport: React.FC = () => {
  const isAuthenticated = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orders = useSelector((state: RootState) => state.order.orders || []);
  const ordersCost = useSelector((state: RootState) => state.order.ordersCost);

  const [formData, setFormData] = useState<any>({});
  const [pageNo, setPageNo] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [flashMessage, setFlashMessage] = useState<string>('');
  const [flashSeverity, setFlashSeverity] = useState<'success' | 'error'>('success');

  const getPalletData = useCallback(async (page: number) => {
    if (loading) return;

    setLoading(true);
    const request = { page, ...formData };
    const response = await dispatch(ordersAction(request));

    if (Array.isArray(response) && response.length === 0) {
      setHasMore(false); // No more data to load
    } else {
      setPageNo((prevPageNo) => prevPageNo + 1);
    }

    setLoading(false);
  }, [dispatch, formData]);

  useEffect(() => {
    if (isAuthenticated) {
      getPalletData(1);
      dispatch(ordersCostAction());
    }

    
return () => {
      dispatch(unmountOrderAction());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 && hasMore && !loading) {
        getPalletData(pageNo);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
return () => window.removeEventListener('scroll', handleScroll);
  }, [pageNo, hasMore, loading]);

  const onFieldChange = (name: string, value: string | null) => {
    setFormData({ ...formData, [name]: value });
  };

  const onSearchClick = () => {
    setPageNo(1);
    setHasMore(true);
    dispatch(clearOrderAction());
    getPalletData(1);
  };

  const onClearClick = () => {
    setFormData({});
    setPageNo(1);
    setHasMore(true);
    dispatch(clearOrderAction());
  };

  const ordersData = () => {
    return (
      orders && Array.isArray(orders) && orders[0] && orders[0].orders && Array.isArray(orders[0].orders) ?
        orders[0].orders.map((value: any, index: number) => (
          <Card key={index} className="mb-4" sx={{ backgroundColor: index % 2 === 0 ? '#f0f4c3' : '#ffecb3', boxShadow: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Typography variant="h6">{value.order_number}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{value.processed_at}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">${value.total_price}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    href={value.order_status_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textTransform: 'none', width: '100%', padding: '8px 0' }}
                    size="medium"
                  >
                    Order Status
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
        : <Card><CardContent>No records found</CardContent></Card>
    );
  };

  if (!isAuthenticated) return null; // Prevent rendering if not authenticated

  return (
    <Container>
      <AppHeader
        headerText="Estore"
        redirectTo={(url: string) => router.push(url)}
      />
      <Box mt={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#e3f2fd', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Total Orders Today</Typography>
                <Typography variant="h4">
                  {ordersCost?.[0]?.OrdersToday || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#c8e6c9', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Total Sales Today</Typography>
                <Typography variant="h4">
                  ${ordersCost?.[1]?.SalesToday?.toFixed(2) || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#ffe0b2', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Total Orders This Month</Typography>
                <Typography variant="h4">
                  {ordersCost?.[2]?.OrdersThisMonth || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#f8bbd0', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Total Sales This Month</Typography>
                <Typography variant="h4">
                  ${ordersCost?.[3]?.SalesThisMonth?.toFixed(2) || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card className="mb-4" sx={{ mt: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate ? dayjs(formData.startDate) : null}
                    onChange={(newValue) => onFieldChange('startDate', newValue ? newValue.format('YYYY-MM-DD') : null)}
                    renderInput={(params) => <TextField {...params} fullWidth size="medium" />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="End Date"
                    value={formData.endDate ? dayjs(formData.endDate) : null}
                    onChange={(newValue) => onFieldChange('endDate', newValue ? newValue.format('YYYY-MM-DD') : null)}
                    renderInput={(params) => <TextField {...params} fullWidth size="medium" />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" fullWidth onClick={onSearchClick} size="large">
                  Search
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="secondary" fullWidth onClick={onClearClick} size="large">
                  Clear
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" fullWidth onClick={() => router.push(webUrl.pallet)} size="large">
                  Back
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {ordersData()}
        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={flashSeverity}>
          {flashMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderReport;
