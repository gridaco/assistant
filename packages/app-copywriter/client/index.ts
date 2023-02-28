import Axios from "axios";

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

export async function prompt(p: TextPrompt): Promise<TextResponse> {
  const { data } = await client.get<TextResponse>("/generative/texts", {
    params: p,
  });

  return data;
}
