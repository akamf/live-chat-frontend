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
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-4">
        <SignedOut>
          <div className="flex items-center justify-center h-full">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <Outlet />
        </SignedIn>
      </main>
      <Footer />
    </section>
  ),
});

const indexRoute = createRoute({ path: '/', component: Index, getParentRoute: () => rootRoute });
const signInRoute = createRoute({ path: '/signin', component: SignIn, getParentRoute: () => rootRoute });
const registerRoute = createRoute({ path: '/register', component: Register, getParentRoute: () => rootRoute });
const profileRoute = createRoute({ path: '/profile', component: Profile, getParentRoute: () => rootRoute });
const settingsRoute = createRoute({ path: '/settings', component: Settings, getParentRoute: () => rootRoute });
const roomListRoute = createRoute({ path: '/chat', component: ChatRoomList, getParentRoute: () => rootRoute });
const roomRoute = createRoute({ path: '/chat/$id', component: ChatRoom, getParentRoute: () => rootRoute });

const routeTree = rootRoute.addChildren([
  indexRoute,
  signInRoute,
  registerRoute,
  profileRoute,
  settingsRoute,
  roomListRoute,
  roomRoute,
]);

export const router = createRouter({ routeTree });
