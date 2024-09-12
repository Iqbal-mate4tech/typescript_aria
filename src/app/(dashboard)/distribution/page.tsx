"use client"
import React from 'react';

import { useRouter } from 'next/navigation';

// import {  useDispatch } from 'react-redux';
import { Card, CardHeader, Typography, Container } from '@mui/material';

// import { RootState } from '../../store'; // Adjust the path as necessary
import AppHeader from '../../../components/app-header';

const Distribution: React.FC = () => {
    const router = useRouter();

    // const dispatch = useDispatch();

    return (
        <Container>
            <AppHeader headerText="Distribution" redirectTo={router.push} />
            <Card className="distribution-card">
                <CardHeader
                    title={
                        <Typography variant="h5" className="dist-title">
                            Will be available soon....
                        </Typography>
                    }
                />
            </Card>
        </Container>
    );
};

export default Distribution;
