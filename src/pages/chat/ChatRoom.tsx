import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { fetchOnlineUsers, fetchPublicChatRooms } from "@utils/api";

const ChatRoomList = () => {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState("");
  const [onlineMap, setOnlineMap] = useState<Record<string, number>>({});
  const [rooms, setRooms] = useState<{ id: string; name: string; maxUsers: number }[]>([]);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchPublicChatRooms();
        setRooms(data.map((room: any) => ({
          id: room.id.toString(),
          name: room.name,
          maxUsers: room.maxUsers
        })));
      } catch (err) {
        console.error("Could not fetch rooms", err);
      }
    };

    loadRooms();
  }, []);
  
  useEffect(() => {
    const loadOnline = async () => {
      try {
        const data = await fetchOnlineUsers();
        setOnlineMap(data);
      } catch (err) {
        console.error("Could not fetch online user count", err);
      }
    };

    loadOnline();

    const interval = setInterval(loadOnline, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomId = e.target.value;
    setSelectedRoom(roomId);
    if (roomId) {
      navigate({ to: `/chat/${roomId}` });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
        💬 Select a Chat Room
      </h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-md">
        Choose a room to enter and start chatting in real time.
      </p>

      <select
        value={selectedRoom}
        onChange={handleSelect}
        className="mt-4 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm"
      >
        <option value="">Select a room...</option>
        {rooms.map((room) => {
          const online = onlineMap[room.id] || 0;
          return (
            <option key={room.id} value={room.id}>
              {`${room.name} ${online}/${room.maxUsers} in room`}
            </option>
          );
        })}
      </select>
    </section>
  );
};

export default ChatRoomList;
