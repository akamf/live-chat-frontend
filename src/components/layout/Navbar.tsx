import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link, useRouterState } from "@tanstack/react-router";

const Navbar = () => {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isActive = (path: string) =>
    currentPath === path
      ? "underline underline-offset-4 decoration-green-500 dark:decoration-green-400"
      : "hover:text-green-700 dark:hover:text-green-400";

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-3 flex flex-wrap justify-between items-center gap-2">
        <Link
          to="/chat"
          className="text-lg font-semibold text-green-700 flex items-center gap-2 dark:text-green-400"
        >
          <span role="img" aria-label="chat">💬</span> ChatApp
        </Link>

        <SignedOut>
          <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
            <SignInButton mode="modal" />
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex flex-wrap gap-4 items-center text-sm text-gray-700 dark:text-gray-300">
            <Link to="/chat" className={isActive("/chat")}>
              Chat
            </Link>
            <Link to="/profile" className={isActive("/profile")}>
              Profile
            </Link>
            {/* <Link to="/settings" className={isActive("/settings")}>
              Settings
            </Link> */}
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </nav>
    </header>
  );
};

export default Navbar;
