import { 
  SignedOut, 
  SignInButton, 
  SignedIn 
} from "@clerk/clerk-react";
import Chat from "./components/Chat";

const App = () => {
  return (
     <main className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <Chat />
      </SignedIn>
    </main>
  );
}

export default App;
