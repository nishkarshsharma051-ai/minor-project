import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children, title }) => {
  return (
    <div className="bg-white min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Topbar title={title} />
        <main className="pt-24 px-10 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
