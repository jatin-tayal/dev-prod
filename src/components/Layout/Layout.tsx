import { useState } from "react";
import { LayoutProps } from "types";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Main from "./Main";
import Footer from "./Footer";
import { useTheme } from "context/ThemeContext";
import { ErrorBoundary } from "../ErrorHandling";
import { ErrorProvider } from "../../context/ErrorContext";

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ErrorProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header
            title="Developer Utilities"
            toggleSidebar={toggleSidebar}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
          />
          <ErrorBoundary>
            <Main>{children}</Main>
          </ErrorBoundary>
          <Footer githubUrl="https://github.com/jatin-tayal/dev-prod" />
        </div>
      </div>
    </ErrorProvider>
  );
};

export default Layout;
