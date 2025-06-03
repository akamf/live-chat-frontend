export interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
};

export interface UserResource {
  id: string;
  fullName: string;
  email: string;
};
