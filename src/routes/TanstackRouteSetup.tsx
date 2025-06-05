import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet
} from '@tanstack/react-router';
import { SignedOut, SignedIn, SignInButton } from '@clerk/clerk-react';

import { Navbar, Footer } from '@components';
import { Index } from '@pages/index';
import { Profile } from '@pages/profile';
import { SignIn, Register } from '@pages/auth';
import { Settings } from '@pages/settings';
import { ChatRoomList, ChatRoom } from '@pages/chat';

const rootRoute = createRootRoute({
  component: () => (
    <section className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">
      <Navbar />
        <SignedOut>
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-12">
              <div className="flex flex-col items-center text-center gap-6 max-w-xl">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                  💬 Welcome to <span className="text-green-600">ChatApp</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                  Join real-time conversations with friends and colleagues. Sign in to get started and connect instantly.
                </p>
                <div className="px-6 py-3 text-white font-semibold rounded bg-green-700 hover:bg-green-800 transition shadow-md">
                  <SignInButton mode="modal" />
                </div>
              </div>
            </main>
        </SignedOut>
        <SignedIn>
          <main className="flex-1 px-4 sm:px-6 md:px-8 py-4 ">
            <Outlet />
          </main>
        </SignedIn>
      <Footer />
    </section>
  ),
});

// const indexRoute = createRoute({ path: '/', component: Index, getParentRoute: () => rootRoute });
const signInRoute = createRoute({ path: '/signin', component: SignIn, getParentRoute: () => rootRoute });
const registerRoute = createRoute({ path: '/register', component: Register, getParentRoute: () => rootRoute });
const profileRoute = createRoute({ path: '/profile', component: Profile, getParentRoute: () => rootRoute });
// const settingsRoute = createRoute({ path: '/settings', component: Settings, getParentRoute: () => rootRoute });
const roomListRoute = createRoute({ path: '/chat', component: ChatRoomList, getParentRoute: () => rootRoute });
const roomRoute = createRoute({ path: '/chat/$id', component: ChatRoom, getParentRoute: () => rootRoute });

const routeTree = rootRoute.addChildren([
  // indexRoute,
  signInRoute,
  registerRoute,
  profileRoute,
  // settingsRoute,
  roomListRoute,
  roomRoute,
]);

export const router = createRouter({ routeTree });
