import { Navigate, useRoutes } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dns from "./pages/Dns";
import Doh from "./pages/Doh";

export default function App() {
  return useRoutes([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Navigate to="dns" replace />,
        },
        {
          path: "dns",
          element: <Dns />,
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
