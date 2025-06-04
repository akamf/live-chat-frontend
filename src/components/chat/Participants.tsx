import { useParticipants } from "@hooks/useParticipants";
import { ChatUser } from "types";
import { useState } from "react";

interface ParticipantsProps {
  roomId: string;
  typingUserIds: Record<string, boolean>;
  textSize: "small" | "medium" | "large";
}

const Participants = ({ roomId, typingUserIds, textSize }: ParticipantsProps) => {
  const participants: ChatUser[] = useParticipants(roomId);
  const [isOpen, setIsOpen] = useState(false);

  const textSizeClass =
    textSize === "small"
      ? "text-sm"
      : textSize === "large"
      ? "text-lg"
      : "text-base";

  return (
    <div className="w-full md:w-1/4 max-w-[75%] relative">
      <div className="md:hidden mb-2 relative z-20">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-semibold"
        >
          👥 Participants {isOpen ? "▲" : "▼"}
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-2 w-full max-h-[250px] overflow-y-auto border rounded p-3 bg-white dark:bg-gray-800 text-sm shadow-lg z-50">
            <ul className="list-disc list-inside space-y-1">
              {participants.map((p, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <span>👤 {p.name}</span>
                  {typingUserIds[p.id] && (
                    <span className="text-xs italic text-gray-500 dark:text-gray-400 ml-1">(typing...)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="hidden md:block w-full min-h-[500px] overflow-y-auto border rounded p-3 bg-white dark:bg-gray-800 text-base shadow-md">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">👥 Participants</h3>
        <ul className="list-disc list-inside space-y-1">
          {participants.map((p, idx) => (
            <li key={idx} className={`flex items-center gap-2 text-gray-700 dark:text-gray-200 ${textSizeClass}`}>
              <span>👤 {p.name}</span>
              {typingUserIds[p.id] && (
                <span className="text-xs italic text-gray-500 dark:text-gray-400 ml-1">(typing...)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Participants;
