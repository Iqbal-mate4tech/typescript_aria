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
      {/* Menu Drawer */}
      {/* <Menu
        id="app-menu"
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={false} // Control this with state if you want the menu to be toggled
        onClose={() => {}}
      >
        <MenuItem disabled>
          <PersonIcon />
          <Typography variant="body1" className="ml-2">{localStorage.getItem('user')}</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body1" className="ml-2">({localStorage.getItem('userName')})</Typography>
        </MenuItem>
        <MenuItem onClick={() => router.push(webUrl.pallet)}>
          <WalletIcon />
          <Typography variant="body1" className="ml-2">Pallets</Typography>
        </MenuItem>
        <MenuItem onClick={() => router.push(webUrl.palletnew)}>
          <WalletIcon />
          <Typography variant="body1" className="ml-2">New Pallets</Typography>
        </MenuItem>
        {hasPermission('OrderReport') && (
          <MenuItem onClick={() => router.push(webUrl.estore)}>
            <AlbumIcon />
            <Typography variant="body1" className="ml-2">Estore</Typography>
          </MenuItem>
        )}
        {hasPermission('Product') && (
          <MenuItem onClick={() => router.push(webUrl.product)}>
            <HomeIcon />
            <Typography variant="body1" className="ml-2">Product</Typography>
          </MenuItem>
        )}
        {hasPermission('ShipperMaster') && (
          <MenuItem onClick={() => router.push(webUrl.shipper)}>
            <AirplaneIcon />
            <Typography variant="body1" className="ml-2">Shipper Master</Typography>
          </MenuItem>
        )}
        {hasPermission('PalletTypeMaster') && (
          <MenuItem onClick={() => router.push(webUrl.palletType)}>
            <BookmarkIcon />
            <Typography variant="body1" className="ml-2">Pallet Type Master</Typography>
          </MenuItem>
        )}
        {hasPermission('UserMaster') && (
          <MenuItem onClick={() => router.push(webUrl.user)}>
            <PeopleIcon />
            <Typography variant="body1" className="ml-2">User Master</Typography>
          </MenuItem>
        )}
        {hasPermission('CategoryMaster') && (
          <MenuItem onClick={() => router.push(webUrl.category)}>
            <HomeIcon />
            <Typography variant="body1" className="ml-2">Category Master</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={() => router.push(webUrl.purchaseOrder)}>
          <BusinessCenterIcon />
          <Typography variant="body1" className="ml-2">Purchase Order</Typography>
        </MenuItem>
        <MenuItem onClick={() => router.push(webUrl.receivePO)}>
          <BusinessCenterIcon />
          <Typography variant="body1" className="ml-2">Receive PO</Typography>
        </MenuItem>
        <MenuItem onClick={() => router.push(webUrl.receivePONew)}>
          <BusinessCenterIcon />
          <Typography variant="body1" className="ml-2">Receive PO New</Typography>
        </MenuItem>
        <MenuItem onClick={() => router.push(webUrl.receivePONewodoo)}>
          <BusinessCenterIcon />
          <Typography variant="body1" className="ml-2">Receive PO Odoo</Typography>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <PowerIcon />
          <Typography variant="body1" className="ml-2">Sign Out</Typography>
        </MenuItem>
      </Menu> */}

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
