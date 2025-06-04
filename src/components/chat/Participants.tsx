import { useParticipants } from "@hooks/useParticipants";

interface ParticipantsProps {
  roomId: string;
};

const Participants = ({ roomId }: ParticipantsProps) => {
  const participants = useParticipants(roomId);

  return (
    <>
      <div className="w-full min-w-[25%] md:w-1/4 border rounded p-3 bg-white dark:bg-gray-800 text-sm">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">👥 Participants</h3>
        <ul className="list-disc list-inside space-y-1">
          {participants.map((p, idx) => (
            <li key={idx} className="text-gray-700 dark:text-gray-200">{p.name}</li>
          ))}
        </ul>
      </div>
    </>
  )
};

export default Participants;
