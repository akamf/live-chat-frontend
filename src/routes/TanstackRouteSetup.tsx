import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet
} from '@tanstack/react-router';
import { SignedOut, SignedIn, SignInButton } from '@clerk/clerk-react';

// import { Navbar, Footer } from '@components';
import { Index } from '@pages/index';
import { Profile } from '@pages/profile';
import { SignIn, Register } from '@pages/auth';
import { Settings } from '@pages/settings';
import { ChatRoomList, ChatRoom } from '@pages/chat';

const rootRoute = createRootRoute({
  component: () => (
    <main className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* <Navbar /> */}
      <SignedOut>
        <div className="flex flex-1 items-center justify-center">
          <SignInButton />
        </div>
      </SignedOut>
      <SignedIn>
        <Outlet />
      </SignedIn>
      {/* <Footer /> */}
    </main>
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
