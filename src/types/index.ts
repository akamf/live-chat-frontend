export interface ChatMessage {
  sender: string;
  senderId: string;
  content: string;
  timestamp: string;
};

export interface ChatUser {
  id: string;
  name: string;
};
