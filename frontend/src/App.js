import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Navigation from "./shared/components/Navigation/Navigation";
import NewPlace from "./places/pages/NewPlace";
import Users from "./user/pages/Users";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./store/auth-context";
import { useAuth } from "./shared/hook/auth";

const App = () => {
  const { token, login, logout, userId } = useAuth();
  let routes;

  if (token) {
    routes = (
      <>
        <Route path="/" element={<Users />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/:id/places" element={<UserPlaces />} />
        <Route path="/new-place" element={<NewPlace />} />
        <Route path="/places/:id" element={<UpdatePlace />} />
      </>
    );
  } else {
    routes = (
      <>
        <Route path="/" element={<Users />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
        <Route path="/:id/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
      </>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLogged: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Navigation />
      <main>
        <Routes>{routes}</Routes>
      </main>
    </AuthContext.Provider>
  );
};

export default App;
