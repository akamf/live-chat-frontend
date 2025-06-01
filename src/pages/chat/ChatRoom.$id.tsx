import { Chat } from "@components";

const ChatRoom = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <h1 className="text-4xl font-bold">🧵 Chat Room</h1>
      <Chat />
    </section>
  );
};

export default ChatRoom;
