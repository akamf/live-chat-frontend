const ChatRoomList = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
        💬 Select a Chat Room
      </h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-md">
        Choose a room to enter and start chatting in real time.
      </p>
    </section>
  );
};

export default ChatRoomList;
