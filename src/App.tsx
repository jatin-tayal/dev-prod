import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import JsonFormatter from "./pages/utilities/JsonFormatter";
import JsonValidator from "./pages/utilities/JsonValidator";
import JsonPathFinder from "./pages/utilities/JsonPathFinder";
import JsonToString from "./pages/utilities/JsonToString";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider, ToastContainer } from "./components/Feedback";
import { ErrorBoundary } from "./components/ErrorHandling";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />

              {/* JSON Utilities */}
              <Route
                path="/utilities/json-formatter"
                element={<JsonFormatter />}
              />
              <Route
                path="/utilities/json-validator"
                element={<JsonValidator />}
              />
              <Route
                path="/utilities/json-path-finder"
                element={<JsonPathFinder />}
              />
              <Route
                path="/utilities/json-to-string"
                element={<JsonToString />}
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer />
          </Layout>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
