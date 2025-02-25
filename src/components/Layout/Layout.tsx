import { useState } from 'react';
import { LayoutProps } from 'types';
import Header from './Header';
import Sidebar from './Sidebar';
import Main from './Main';

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Developer Utilities" toggleSidebar={toggleSidebar} />
        <Main>{children}</Main>
      </div>
    </div>
  );
};

export default Layout;
