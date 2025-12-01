export interface ChatMessage {
  chatId: string;
  sender: string;
  content: string;
  sentAt: string;
}

export interface ChatSummary {
  chatId: string;
  chatmateName: string;
  chatmateSurname: string;
  chatmateAvatar: string;
  lastMessage: ChatMessage | null;
}

export interface ChatmateInfo {
  chatmateId: string;
  name: string;
  surname: string;
  avatar: string;
  description: string;
  orderName: string;
}

export interface CreateChatResponse {
  chatId: string;
}

export interface ChatsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  creating: boolean;
  lastCreated: CreateChatResponse | null;
  items: ChatSummary[];
  messagesByChat: Record<string, ChatMessage[]>;
  chatmates: Record<string, ChatmateInfo>;
  currentChatId: string | null;
  wsConnected: boolean;
  error: string | null;
}
