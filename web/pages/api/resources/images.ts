import { NextApiRequest, NextApiResponse } from "next";
import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_API_CLIENT_ID,
});

// @ts-ignore FIXME: (Awaited available from ts 4.5)
type Photo = Awaited<ReturnType<typeof unsplash.photos.get>>["response"];

const mapphoto = (r: Photo) => ({
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
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = req.query.q as string;
  const page = req.query.page as string;

  let images = [];
  let total_pages = 0;
  let n = 0;

  if (!q.trim().length) {
    const __n = 20;
    // if no query, get radom images.
    const { response } = await unsplash.photos.getRandom({
      featured: true,
      count: __n,
    });
    images = (response as Array<any>).map(mapphoto);
    total_pages = 1;
    n = __n;
  } else {
    const { response } = await unsplash.search.getPhotos({
      query: q,
      orderBy: "relevant",
      page: parseInt(page) ?? 1,
    });

    images = response.results.map(mapphoto);
    total_pages = response.total_pages;
    n = response.total;
  }

  switch (req.method) {
    case "GET":
      res.status(200).json({
        q: q,
        pages: total_pages,
        images: images,
        n: n,
      });
      break;
  }
}
