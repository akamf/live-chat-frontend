import { useUser } from "@clerk/clerk-react";
import { useClerkToken } from "@hooks/useClerkToken";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useUser();
  const { fetchToken } = useClerkToken();
  const [name, setName] = useState(user?.fullName || user?.username || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await fetchToken();
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) throw new Error("Failed to load user");

        const data = await res.json();
        setName(data.name);
      } catch (err) {
        toast.error("Failed to load profile.");
      }
    };

    if (user) fetchUser();
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty");

    try {
      setLoading(true);
      const token = await fetchToken();

      const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to update user");

      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Could not save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 space-y-6 border">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">PROFILE</h2>
        <div className="flex justify-center">
          <img
            src={user?.imageUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-gray-400 object-cover"
          />
        </div>
        <div className="text-left space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Display Name
            </label>
            {!name && loading ? (
              <div className="text-gray-500 italic">Loading profile...</div>
            ) : (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600 dark:bg-gray-700 dark:text-white"
              />
            )}
          </div>
        </div>
        <div className="text-left space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="text"
              value={user?.emailAddresses[0]?.emailAddress || ""}
              readOnly
              disabled
              className="w-full px-3 py-2 border rounded focus:ring-2 dark:bg-gray-700 dark:text-gray-400"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-2 bg-green-700 hover:bg-green-500 text-white font-semibold rounded transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "SAVE"}
        </button>
      </div>
    </section>
  );
};

export default Profile;
