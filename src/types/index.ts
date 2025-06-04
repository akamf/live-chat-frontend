export interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
};

export interface ChatUser {
  id: string;
  name: string;
};
