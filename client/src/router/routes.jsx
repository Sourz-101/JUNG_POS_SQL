import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import Main from '../layouts/Main.jsx'
import Plain from "../layouts/Plain.jsx";
import ProdcutView from "../pages/ProdcutView.jsx";
import Level1 from "../pages/Level1.jsx";
import Level2 from "../pages/Level2.jsx";
import Level3 from "../pages/Level3.jsx";
import Level4 from "../pages/Level4.jsx";
import EditProduct from "../pages/EditProduct.jsx";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        { path: "/", element: <Home />},
        { path:`/product/:_id`, element:<ProdcutView/>}
      ],
    },
    {
      path: "/select",
      element: <Level1 />,
    },
    {
      path: "/select/:series",
      element: <Level2 />,
    },
    {
      path: "/select/:series/:category",
      element: <Level3 />,
    },
    {
      path: "/select/:series/:category/:color",
      element: <Level4 />,
    },
    {
      path: "/select/:series/:category/:color/:_id",
      element: <ProdcutView />,
    },
    {
      path: "/:_id",
      element: <ProdcutView />,
    },
    {
      path:"select/:series/:category/:color/:_id/editproduct",
      element:<EditProduct/>
    },
    {
      path:"/:_id/editproduct",
      element:<EditProduct/>
    },
    {
      path: "/welcome",
      element: <Plain />,
      children: [
        {
          path: "/welcome/login",
          element: <Login />
        }
      ]
    }
   
  ]);
  
  export default router;