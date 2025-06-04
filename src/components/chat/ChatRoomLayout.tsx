import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useClerkToken } from "@hooks/useClerkToken";

import Chat from "./Chat";
import Participants from "./Participants";

interface ChatRoomProps {
  roomId: string;
};

const ChatRoomLayout = ({ roomId }: ChatRoomProps) => {
  const { user } = useUser();

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 w-full h-full md:max-w-[75%]">
        <Participants roomId={ roomId } />
        <Chat user={ user } roomId={ roomId } />
      </div>
    </>
  );
};

export default ChatRoomLayout;
