import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Stages from "./Stages.jsx";
import Stage from "./Stage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Stages />,
  },
  {
    path: "/stages",
    element: <Stages />,
  },
  {
    path: "/stage/:stageId/:stageName",
    element: <Stage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
