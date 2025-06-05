import { ChatRoomLayout } from "@components";
import { useParams } from "@tanstack/react-router";
import { fetchPublicChatRooms } from "@utils/api";
import { useEffect, useState } from "react";

const ChatRoom = () => {
  const { id: roomId } = useParams({ from: "/chat/$id" });
    const [room, setRoom] = useState<{ id: string; name: string; topic: string } | null>(null);


  useEffect(() => {
    const loadRoom = async () => {
      try {
        const rooms = await fetchPublicChatRooms();
        const found = rooms.find((r: any) => r.id.toString() === roomId);
        if (found) setRoom(found);
      } catch (err) {
        console.error("Could not load room info", err);
      }
    };

    loadRoom();
  }, [roomId]);

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
        {room?.name ?? "Chat Room"}
      </h1>
      {room?.topic && (
        <p className="text-gray-600 dark:text-gray-300 max-w-md italic">{room.topic}</p>
      )}
      <ChatRoomLayout roomId={roomId} />
    </section>
  );
};

export default ChatRoom;
