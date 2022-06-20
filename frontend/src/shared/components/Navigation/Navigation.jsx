import React, { useState } from "react";
import { Link } from "react-router-dom";

import Header from "./Header";
import Links from "./Links";
import Drawer from "./Drawer";
import Backdrop from "../UIElements/Backdrop.jsx";

import "./Navigation.css";

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
  };
  return (
    <>
      {drawerOpen && <Backdrop onClick={closeDrawer} />}

      <Drawer show={drawerOpen} onClick={closeDrawer}>
        <nav className="main-navigation-drawer-nav">
          <Links />
        </nav>
      </Drawer>

      <Header>
        <button className="main-navigation-menu-btn" onClick={toggleDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation-title">
          <Link to="/">Checker</Link>
        </h1>
        <nav className="main-navigation-header-nav">
          <Links />
        </nav>
      </Header>
    </>
  );
};

export default Navigation;
