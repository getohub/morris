import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavigation from '../app/AppNavigation';
import Footer from './Footer';

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AppNavigation />
      <div className="flex-grow pt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;