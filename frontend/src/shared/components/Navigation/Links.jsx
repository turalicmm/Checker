import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../../store/auth-context";
import "./Links.css";

const Links = () => {
  const authCtx = useContext(AuthContext);

  const logoutHandler = () => {
    authCtx.logout();
  };
  return (
    <ul className="nav-links">
      <li>
        <Link to="/">All Users</Link>
      </li>
      {authCtx.isLogged && (
        <li>
          <Link to={`/${authCtx.userId}/places`}>My Places</Link>
        </li>
      )}
      {authCtx.isLogged && (
        <li>
          <Link to="/new-place">Add Place</Link>
        </li>
      )}

      {!authCtx.isLogged && (
        <li>
          <Link to="/auth">Auth</Link>
        </li>
      )}

      {authCtx.isLogged && (
        <li>
          <button onClick={logoutHandler}>Logout</button>
        </li>
      )}
    </ul>
  );
};

export default Links;
