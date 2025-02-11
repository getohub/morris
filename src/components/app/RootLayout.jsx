import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavigation from '../app/AppNavigation';

const RootLayout = () => {
  return (
    <div>
      <AppNavigation />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;