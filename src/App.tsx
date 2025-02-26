import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import JsonFormatter from './pages/utilities/JsonFormatter';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, ToastContainer } from './components/Feedback';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Utility routes */}
            <Route path="/utilities/json-formatter" element={<JsonFormatter />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </Layout>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;