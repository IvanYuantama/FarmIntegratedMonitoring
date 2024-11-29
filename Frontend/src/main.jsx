import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import BlynkToggleButton from "./components/BlynkToggleButton.jsx";
import Notif from "./components/Notif.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import AutomationPage from "./components/AutomationPage.jsx";
import KalkulasiPupuk from "./components/KalkulasiPupuk.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <BlynkToggleButton />,
  },
  {
    path: "/notifikasi",
    element: <Notif />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/automation",
    element: <AutomationPage />,
  },
  {
    path: "/pupuk",
    element: <KalkulasiPupuk />,
  },
  {
    path: "/error",
    element: <ErrorBoundary />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
