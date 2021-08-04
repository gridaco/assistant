/// checksum api
/// backend is not ready. this is a dummy placeholder.

import Axios, { AxiosInstance } from "axios";

let __client: AxiosInstance; // client chache

const _client = async () => {
  if (__client) {
    return __client;
  } else {
    __client = Axios.create({
      baseURL: "https://figma-link-service.grida.cc",
      headers: {
        Authorization:
          "Bearer " + (await figma.clientStorage.getAsync("access_token")),
      },
    });

    return __client;
  }
};

export async function checksum(filedid: string): Promise<boolean> {
  try {
    const res = await (
      await _client()
    ).post("/file-checksum/validate", {
      fileid: filedid,
    });

    return res.data.valid as boolean;
  } catch (error) {
    throw error;
  }
}
