import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate, Link } from "react-router-dom";

import { Role } from "./helpers";
import { authenticationService } from "./services";
import PrivateRoute from "./PrivateRoute";
import HomePage from "./components/Home/Home";
import AdminPage from "./components/Admin/Admin";
import LoginPage from "./components/Login/Login";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const subscription = authenticationService.currentUser.subscribe((x) => {
      setCurrentUser(x);
      setIsAdmin(x && x.role === Role.Admin);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = () => {
    authenticationService.logout();
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      {currentUser && (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="navbar-nav">
            <Link to="/" className="nav-item nav-link">
              Home
            </Link>
            {isAdmin && (
              <Link to="/admin-dashboard" className="nav-item nav-link">
                Admin
              </Link>
            )}
            <a onClick={logout} className="nav-item nav-link">
              Logout
            </a>
          </div>
        </nav>
      )}
      <div className="jumbotron">
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3"></div>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin-dashboard"
                element={
                  <PrivateRoute>
                    <AdminPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
