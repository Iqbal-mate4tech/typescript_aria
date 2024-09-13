// src/components/app-header/index.tsx
"use client"
import React from 'react';

import { useRouter } from 'next/navigation';

import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import {
  Add as AddIcon, Home as HomeIcon, 
  Call as CallIcon, BusAlert as BusIcon,  
  Sync as SyncIcon, Upload as UploadIcon,  
   FlashOn as FlashOnIcon, 
  FlashOff as FlashOffIcon,  Refresh as RefreshIcon
} from '@mui/icons-material';

// import { hasPermission } from '../../shared/common';
import { webUrl } from '../../shared/constants';

interface AppHeaderProps {
  headerText: string;
  showAddPalletIcon?: boolean;
  showBookingIcon?: boolean;
  showDispatchIcon?: boolean;
  showSyncIcon?: boolean;
  publishProduct?: boolean;
  unPublishProduct?: boolean;
  uploadProductImg?: boolean;
  showProductSyncIcon?: boolean;
  showAdd?: boolean;
  reload?: boolean;
  syncStatus?: boolean;
  onSyncClick?: () => void;
  onPublishProduct?: () => void;
  onUnPublishProduct?: () => void;
  onUploadProductImg?: () => void;
  onProductSyncClick?: () => void;
  onAddClick?: () => void;
  onReloadClick?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = (props) => {
  const router = useRouter();

  const handleSignOut = () => {
    const userId = localStorage.getItem('user');
    const userName = localStorage.getItem('userName');

    localStorage.clear();
    if (userId) localStorage.setItem('user', userId);
    if (userName) localStorage.setItem('userName', userName);
    router.push(webUrl.signIn);
  };

  return (
    <>

      {/* App Header */}
      <AppBar position="static" className='mb-12 rounded-lg p-2'>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" className="flex-grow text-black font-bold">
            {props.headerText}
          </Typography>
          <Box>
            {props.showAddPalletIcon && (
              <IconButton color="inherit" onClick={() => router.push(webUrl.addUpdatePallet)}>
                <AddIcon />
              </IconButton>
            )}
            {props.showBookingIcon && (
              <IconButton color="inherit" onClick={() => router.push(webUrl.palletBooking)}>
                <CallIcon />
              </IconButton>
            )}
            {props.showDispatchIcon && (
              <IconButton color="inherit" onClick={() => router.push(webUrl.palletDispatch)}>
                <BusIcon />
              </IconButton>
            )}
            {props.showSyncIcon && (
              <IconButton color="inherit" onClick={props.onSyncClick}>
                <SyncIcon className={props.syncStatus ? 'animate-spin' : ''} />
              </IconButton>
            )}
            {props.publishProduct && (
              <IconButton color="inherit" onClick={props.onPublishProduct}>
                <FlashOnIcon />
              </IconButton>
            )}
            {props.unPublishProduct && (
              <IconButton color="inherit" onClick={props.onUnPublishProduct}>
                <FlashOffIcon />
              </IconButton>
            )}
            {props.uploadProductImg && (
              <IconButton color="inherit" onClick={props.onUploadProductImg}>
                <UploadIcon />
              </IconButton>
            )}
            {props.showProductSyncIcon && (
              <IconButton color="inherit" onClick={props.onProductSyncClick}>
                <SyncIcon className={props.syncStatus ? 'animate-spin' : ''} />
              </IconButton>
            )}
            {props.showAdd && (
              <IconButton color="inherit" onClick={props.onAddClick}>
                <AddIcon />
              </IconButton>
            )}
            {props.reload && (
              <IconButton color="inherit" onClick={props.onReloadClick}>
                <RefreshIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};


export default AppHeader;
