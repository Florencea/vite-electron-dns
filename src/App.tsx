import { Navigate, useRoutes } from "react-router-dom";
import { Layout } from "./components/Layout";
import Doh from "./pages/Doh";

export default function App() {
  return useRoutes([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Navigate to="doh" replace />,
        },
        {
          path: "doh",
          element: <Doh />,
        },
      ],
    },
    { path: "*", element: <Navigate to="" replace /> },
  ]);
}
