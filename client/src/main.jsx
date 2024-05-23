import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import axios from "axios";
import { RouterProvider } from "react-router-dom";
import router from "./router/routes.jsx";
import { Toaster } from "react-hot-toast";

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
    <div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  </>
);
