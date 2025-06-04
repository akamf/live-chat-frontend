import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { router } from "routes/TanstackRouteSetup";
import { login } from "@utils/api";

import { useIdleSignOut } from "@hooks/useIdleSignOut";
import { RouterProvider } from "@tanstack/react-router";

const App = () => {
  const { user } = useUser();
  useIdleSignOut();
  
  useEffect(() => {
    if (!user) return;

    login(user);
  }, [user]);
  
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />;
    </>
  );
};

export default App;
