import Axios from "axios";

const client = Axios.create({
  baseURL: "/api",
});

interface SearchQuery {
  q: string;
  page?: number;
}

interface GenPrompt {
  q: string;
  style?: string;
}

interface GenerativeResponse {
  q: string;
  n: number;
  images: string[];
  size: "1024x1024" | "512x512" | "256x256";
}

interface ResourceResponse {
  q: string;
  n: number;
  images: {
    id: string;
    thumbnail: string;
    url: string;
    full: string;
    raw: string;
    alt: string;
    color: string;
    width: number;
    height: number;
    author: {
      username: string;
      name: string;
    };
  }[];
  pages: number;
}

export async function fromGenerative(
  p: GenPrompt,
  accessToken: string
): Promise<GenerativeResponse> {
  try {
    const { data } = await client.get("/generative/images", {
      params: p,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return data;
  } catch (e) {
    // if 401
    if (e.response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw e;
  }
}

export async function fromResources(p: SearchQuery): Promise<ResourceResponse> {
  const { data } = await client.get("/resources/images", {
    params: p,
  });

  return data;
}
