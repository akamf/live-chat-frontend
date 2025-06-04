import { formatDate } from "@utils/date";
import React, { useState } from "react";

interface ChatBubbleProps {
  sender: string;
  content: string;
  timestamp: string;
  isOwnMessage: boolean;
  index: number;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  content,
  timestamp,
  isOwnMessage,
  index
}) => {
  const [visibleDates, setVisibleDates] = useState<{ [index: number]: boolean }>({});
  const showDate = visibleDates[index] === true;

  return (
    <div
      key={index}
      className={`flex w-full mb-3 ${isOwnMessage ? "justify-end" : "justify-start"} animate-fade-in`}
      onClick={() => setVisibleDates(prev => ({ ...prev, [index]: !prev[index] }))}
    >
      <div
        className={`relative max-w-[70%] min-w-[40%] px-3 py-2 rounded-lg bg-gray-300 text-black dark:text-white ${
          isOwnMessage
            ? "dark:bg-gray-600 text-right rounded-br-md"
            : "dark:bg-gray-700 rounded-bl-md"
        }`}
      >
        <div className="text-sm">{content}</div>
        <div className="mt-2 text-xs font-semibold">
          {isOwnMessage ? (
              <>
                <span className="italic text-gray-900 dark:text-gray-300">{showDate ? `${formatDate(timestamp)} ` : ""}</span>{sender}
              </>

            ) : (
              <>
                {sender}<span className="italic text-gray-900 dark:text-gray-300">{showDate ? ` ${formatDate(timestamp)}` : ""}</span>
              </>
            )}
            
          </div>
      </div>
    </div>
  );
};

export default ChatBubble;
