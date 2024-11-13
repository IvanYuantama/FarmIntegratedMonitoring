import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "./components/default-comp/Navbar";
import { useLoginStatus } from "./components/loginStatus/loginStatus";

function App() {
  const { accountLogged, setAccountLogged } = useLoginStatus();

  return (
    <div className="pt-10">
      <ScrollRestoration />

      <Navbar accountLogged={accountLogged} />

      <Outlet />
    </div>
  );
}

export default App;
