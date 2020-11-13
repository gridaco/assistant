import { upload } from "@bridged.xyz/client-sdk/lib/hosting";
// import { upload } from "uguu-api"
import { ImageAsset, TransportableImageRepository } from "../image-repository";


export class ImageHostingRepository {
    static imageRepostory: TransportableImageRepository
    static setRepository(repo: TransportableImageRepository) {
        console.info(`registered image repo of buildid ${repo.buildId} to image hosting repo`)
        this.imageRepostory = repo
    }

    static async hostImages(): Promise<Map<string, string>> {
        return await hostImages(this.imageRepostory.images)
    }
}


// currently returns preservedurl:hostedurl
// TODO -> return key:hostedurl
async function hostImages(images: ReadonlyArray<ImageAsset>): Promise<Map<string, string>> {
    const hostedImages = new Map<string, string>();

    // upload all images async
    const jobs: Array<Promise<string>> = []
    for (const asset of images) {
        jobs.push(hostImage(asset.key, asset.data))
    }
    // wait for all images to be fetched from design. and uploaded to hosting server
    const urls = await Promise.all<string>(jobs)

    let i = 0
    for (const asset of images) {
        hostedImages[asset.url] = urls[i]
        i++
    }

    return hostedImages
}

async function hostImage(key: string, data: Uint8Array): Promise<string> {
    const fileName = `${key}.png`
    const fileBlob = new Blob([data], {
        type: "image/png"
    })
    // const uploaded = await upload(fileName, fileBlob)

    const uploaded = await upload({
        file: fileBlob,
        name: fileName,
    })
    return uploaded.url
}