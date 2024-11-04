"use client"
import React from 'react';

import { useRouter } from 'next/navigation';

import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, Typography, Container } from '@mui/material';

import { RootState } from '../../store'; // Adjust the path as necessary
import AppHeader from '../../../components/app-header';
import useAuth from '@/components/withAuth';

const Distribution: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const isAuthenticated = useAuth();

    if (!isAuthenticated) return null;

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
