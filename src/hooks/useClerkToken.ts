import { useAuth } from "@clerk/clerk-react";

export const useClerkToken = () => {
  const { getToken } = useAuth();

  const fetchToken = async (): Promise<string | null> => {
    return await getToken({ template: "Login-User-JWT" });
  };

  return { fetchToken };
};
