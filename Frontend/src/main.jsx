import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import BlynkToggleButton from "./components/BlynkToggleButton.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BlynkToggleButton />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
