import React from 'react';

import { useRouter } from 'next/router';

import { Backdrop, CircularProgress, Typography } from '@mui/material';
import { connect } from 'react-redux';

interface LoaderProps {
  showLoader: string[];
}

const Loader: React.FC<LoaderProps> = ({ showLoader }) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={showLoader && showLoader.length > 0}
    >
      <CircularProgress color="inherit" />
      <Typography variant="h6" sx={{ ml: 2 }}>
        Please wait...
      </Typography>
    </Backdrop>
  );
};

const mapStateToProps = (state: any) => ({
  showLoader: state.user.showLoader,
});

export default connect(mapStateToProps)(Loader);
