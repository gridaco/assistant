import { NextApiRequest, NextApiResponse } from "next";
import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_API_CLIENT_ID,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = req.query.q as string;
  const page = req.query.page as string;

  const { response } = await unsplash.search.getPhotos({
    query: q,
    orderBy: "relevant",
    page: parseInt(page) ?? 1,
  });

  const images = response.results.map((r) => ({
    id: r.id,
    thumbnail: r.urls.thumb,
    url: r.urls.regular,
    full: r.urls.full,
    raw: r.urls.raw,
    alt: r.alt_description,
    color: r.color,
    width: r.width,
    height: r.height,
    author: {
      username: r.user.username,
      name: r.user.name,
    },
  }));

  switch (req.method) {
    case "GET":
      res.status(200).json({
        q: q,
        pages: response.total_pages,
        images: images,
        n: response.total,
      });
      break;
  }
}
