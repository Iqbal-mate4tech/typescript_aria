'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Button from '@mui/material/Button';
import type { ReactNode } from 'react';
import LayoutWrapper from '@layouts/LayoutWrapper';
import VerticalLayout from '@layouts/VerticalLayout';
import HorizontalLayout from '@layouts/HorizontalLayout';
import Navigation from '@components/layout/vertical/Navigation';
import Header from '@components/layout/horizontal/Header';
import Navbar from '@components/layout/vertical/Navbar';
import VerticalFooter from '@components/layout/vertical/Footer';
import HorizontalFooter from '@components/layout/horizontal/Footer';
import ScrollToTop from '@core/components/scroll-to-top';

interface LayoutClientProps {
  children: ReactNode;
  mode: any;
  systemMode: any;
  direction: string;
}

const LayoutClient = ({ children, mode, systemMode, direction }: LayoutClientProps) => {
  const pathname = usePathname();

  // Check if the current path is exactly '/sign-in'
  const isLoginPage = pathname === '/user_master';

  return (
    <>
      {isLoginPage ? (
        // Render only the children (content of the login page) without layout components
        <>{children}</>
      ) : (
        // Render the full layout with sidebar and topbar
        <LayoutWrapper
          systemMode={systemMode}
          verticalLayout={
            <VerticalLayout
              navigation={<Navigation mode={mode} systemMode={systemMode} />}
              navbar={<Navbar />}
              footer={<VerticalFooter />}
            >
              {children}
            </VerticalLayout>
          }
          horizontalLayout={
            <HorizontalLayout header={<Header />} footer={<HorizontalFooter />}>
              {children}
            </HorizontalLayout>
          }
        />
      )}
      {!isLoginPage && (
        <ScrollToTop className="mui-fixed">
          <Button variant="contained" className="is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center">
            <i className="ri-arrow-up-line" />
          </Button>
        </ScrollToTop>
      )}
    </>
  );
};

export default LayoutClient;
