export interface CreateChatResponse {
  chatId: number;
  status: string;
}

export interface ChatsState {
  creating: boolean;
  lastCreated: CreateChatResponse | null;
  error: string | null;
}
