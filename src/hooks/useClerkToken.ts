import { useAuth } from "@clerk/clerk-react";

export const useClerkToken = () => {
  const { getToken } = useAuth();

  const storeToken = async () => {
    const token = await getToken({ template: "Login-User-JWT" });
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  return { storeToken };
};
