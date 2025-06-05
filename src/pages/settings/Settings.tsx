import { useClerkToken } from "@hooks/useClerkToken";
import { useState } from "react";
import toast from "react-hot-toast";

const Settings = () => {
  const [textSize, setTextSize] = useState<"small" | "medium" | "large">("medium");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const { fetchToken } = useClerkToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await fetchToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ textSize, theme })
      });

      if (!res.ok) throw new Error("Failed to update settings");
      toast.success("Settings saved!");
    } catch (err) {
      console.error("Error updating settings:", err);
      toast.error("Failed to save settings");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-gray-800 border rounded-lg shadow-md p-6 space-y-6"
      >
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-4">
          ⚙️ Settings
        </h2>

        <div className="text-left">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Text Size</label>
          <div className="space-x-4">
            <label>
              <input
                type="radio"
                value="small"
                checked={textSize === "small"}
                onChange={() => setTextSize("small")}
                className="mr-1"
              />
              Small
            </label>
            <label>
              <input
                type="radio"
                value="medium"
                checked={textSize === "medium"}
                onChange={() => setTextSize("medium")}
                className="mr-1"
              />
              Medium
            </label>
            <label>
              <input
                type="radio"
                value="large"
                checked={textSize === "large"}
                onChange={() => setTextSize("large")}
                className="mr-1"
              />
              Large
            </label>
          </div>
        </div>

        <div className="text-left">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
          <div className="space-x-4">
            <label>
              <input
                type="radio"
                value="light"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
                className="mr-1"
              />
              Light
            </label>
            <label>
              <input
                type="radio"
                value="dark"
                checked={theme === "dark"}
                onChange={() => setTheme("dark")}
                className="mr-1"
              />
              Dark
            </label>
            <label>
              <input
                type="radio"
                value="system"
                checked={theme === "system"}
                onChange={() => setTheme("system")}
                className="mr-1"
              />
              System
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-700 hover:bg-green-500 text-white font-semibold rounded transition disabled:opacity-50"
        >
          SAVE
        </button>
      </form>
    </section>
  );
};

export default Settings;
