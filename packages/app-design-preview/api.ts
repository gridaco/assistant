// TODO: migrate this to @base-sdk

import Axios from "axios";

const client = Axios.create({
  baseURL: "https://pages.grida.cc",
});

interface PagePutRequest {
  filekey: string;
  id: string;
  document: string;
  assets: { [key: string]: Blob };
}

interface PagePutResponse {
  status: string;
  page_path: string;
  page_id: string;
  page_url: string;
}

export async function publishPage(req: PagePutRequest) {
  const { filekey, document, id } = req;
  const form = new FormData();

  form.append("id", id);
  form.append("document", document);

  Object.keys(req.assets).forEach((key) => {
    const asset = req.assets[key];
    form.append("assets", asset, key);
  });

  //@ts-ignore
  const header = form.getHeaders
    ? {
        //@ts-ignore
        "content-type": form.getHeaders()["content-type"],
        //@ts-ignore
        "content-length": form.getLengthSync(),
      }
    : undefined;

  const res = await client.put<PagePutResponse>(`/figma/${filekey}`, form, {
    headers: header,
  });

  return res.data;
}
