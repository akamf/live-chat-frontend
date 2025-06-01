import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-lg font-semibold text-green-700 flex items-center gap-2">
          <span role="img" aria-label="chat">💬</span> ChatApp
        </Link>

        <SignedOut>
          <div className="flex gap-4 text-sm">
            <Link to="/signin" className="text-gray-700 hover:text-green-700">
              Log In
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-green-700">
              Register
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex gap-4 items-center text-sm">
            <Link to="/chat" className="text-gray-700 hover:text-green-700">
              Chat
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-green-700">
              Profile
            </Link>
            <Link to="/settings" className="text-gray-700 hover:text-green-700">
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
