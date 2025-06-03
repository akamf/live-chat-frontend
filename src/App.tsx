import { useUser } from "@clerk/clerk-react";
import { RouterProvider } from "@tanstack/react-router";
import { login } from "@utils/api";
import { useEffect } from "react";
import { router } from "routes/TanstackRouteSetup";

const App = () => {
  const { user } = useUser();
  
  useEffect(() => {
    if (!user) return;

    login(user);
  }, [user]);
  
  return <RouterProvider router={router} />;
};

export default App;
