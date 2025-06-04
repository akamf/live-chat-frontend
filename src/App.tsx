import { useUser } from "@clerk/clerk-react";
import { useIdleSignOut } from "@hooks/useIdleLogout";
import { RouterProvider } from "@tanstack/react-router";
import { login } from "@utils/api";
import { useEffect } from "react";
import { router } from "routes/TanstackRouteSetup";

const App = () => {
  const { user } = useUser();
  useIdleSignOut();
  
  useEffect(() => {
    if (!user) return;

    login(user);
  }, [user]);
  
  return <RouterProvider router={router} />;
};

export default App;
