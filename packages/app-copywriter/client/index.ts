import Axios from "axios";
import type { Message } from "../core/conversation";

const client = Axios.create({
  baseURL: "/api",
});

interface TextResponse {
  q: string;
  texts: string[];
  model: string;
}

interface TextPrompt {
  q: string;
}

export async function copies(p: TextPrompt): Promise<TextResponse> {
  const { data } = await client.get<TextResponse>("/generative/copies", {
    params: p,
  });

  return data;
}

interface ChatPrompt {
  content: string;
  history: Message[];
}

interface ChatResponse {
  q: string;
  meta: any;
  response: string;
  model: string;
}

export async function chat(p: ChatPrompt): Promise<ChatResponse> {
  const { data } = await client.post<ChatResponse>("/generative/chat", {
    data: p,
  });

  return data;
}
