export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// In-memory store — replace with DB later
const store = new Map<string, Conversation>();

export function getConversation(id: string): Conversation | undefined {
  return store.get(id);
}

export function listConversations(): Conversation[] {
  return Array.from(store.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function createConversation(id: string): Conversation {
  const conv: Conversation = {
    id,
    title: "New conversation",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  store.set(id, conv);
  return conv;
}

export function addMessage(
  conversationId: string,
  message: Message,
): Conversation {
  let conv = store.get(conversationId);
  if (!conv) {
    conv = createConversation(conversationId);
  }
  conv.messages.push(message);
  conv.updatedAt = Date.now();

  // Auto-title from first user message
  if (conv.title === "New conversation" && message.role === "user") {
    conv.title = message.content.slice(0, 60) + (message.content.length > 60 ? "..." : "");
  }

  return conv;
}

export function deleteConversation(id: string): boolean {
  return store.delete(id);
}
