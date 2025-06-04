import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { router } from "routes/TanstackRouteSetup";
import { login } from "@utils/api";

import { useIdleSignOut } from "@hooks/useIdleSignOut";
import { RouterProvider } from "@tanstack/react-router";
import { useClerkToken } from "@hooks/useClerkToken";

const App = () => {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const [authReady, setAuthReady] = useState(false);
  const { storeToken } = useClerkToken();
  
  useIdleSignOut();
  
  useEffect(() => {
    const doLogin = async () => {
      if (!isUserLoaded) return;

      if (!isSignedIn || !user) {
        setAuthReady(true);
        return;
      }
      
      await storeToken();

      const success = await login(user);
      if (!success) {
        toast.error("Failed to log in, due to server issues. Try again later.");
        setTimeout(async () => {
          await signOut();
        }, 2000);
        return;
      }
      
      router.navigate({ to: "/chat" });
      setAuthReady(true);
    };

    doLogin();
  }, [isUserLoaded, isSignedIn, user]);

  if (!authReady) {
    return (
      <>
        <Toaster position="top-right" />
         <section className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">
          <main className="flex-1 px-4 sm:px-6 md:px-8 py-4">
            <div className="flex flex-col justify-center items-center h-screen space-y-4">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading your session...</p>
            </div>
          </main>
        </section>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />;
    </>
  );
};

export default App;
