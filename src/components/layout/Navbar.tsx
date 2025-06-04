import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-2">
        <Link
          to="/"
          className="text-lg font-semibold text-green-700 flex items-center gap-2 dark:text-green-400"
        >
          <span role="img" aria-label="chat">💬</span> ChatApp
        </Link>

        <SignedOut>
          <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
            <Link to="/signin" className="hover:text-green-700 dark:hover:text-green-400">
              Log In
            </Link>
            <Link to="/register" className="hover:text-green-700 dark:hover:text-green-400">
              Register
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex gap-4 items-center text-sm text-gray-700 dark:text-gray-300">
            <Link to="/chat" className="hover:text-green-700 dark:hover:text-green-400">
              Chat
            </Link>
            <Link to="/profile" className="hover:text-green-700 dark:hover:text-green-400">
              Profile
            </Link>
            <Link to="/settings" className="hover:text-green-700 dark:hover:text-green-400">
              Settings
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </nav>
    </header>
  );
};

export default Navbar;
