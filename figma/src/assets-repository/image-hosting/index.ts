// host images that target node holds

// import { upload } from "@bridged.xyz/client-sdk/lib/hosting";

export class ImageRepositories {
    static repositories: Map<string, ImageRepository> = new Map<string, ImageRepository>();
    static imageHashMap: Map<string, Uint8Array> = new Map<string, Uint8Array>();

    private static _current: ImageRepository
    static get current(): ImageRepository {
        if (!this._current) {
            const buildId = `${Date.now()}`
            this._current = new ImageRepository(buildId)
        }
        return this._current;
    }

    static clear() {
        this.repositories = new Map<string, ImageRepository>();
        this.imageHashMap = new Map<string, Uint8Array>()
    }

    /**
     * registers new image repository
     * @param repository 
     */
    static register(repository: ImageRepository) {
        this.repositories[repository.buildId] = repository;
    }

    /**
     * removes image repository registration from image repositories by buildid
     * @param buildId 
     */
    static delete(buildId: string) {
        this.repositories.delete(buildId)
    }

    static registerDataWithHash(hash: string, data: Uint8Array) {
        this.imageHashMap[hash] = data
    }

    static async fetchDataByHash(hash: string): Promise<Uint8Array> {
        if (this.isImageHashRegistered(hash)) {
            return this.imageHashMap[hash]
        }
        const image = figma.getImageByHash(hash)
        const imageData = await image.getBytesAsync()
        this.registerDataWithHash(hash, imageData)
        return imageData
    }

    static isImageHashRegistered(hash: string): boolean {
        return this.imageHashMap.has(hash)
    }
}

export abstract class TemporaryAsset<T> {
    data?: T
    url: string
    constructor(readonly key: string, args?: {
        url?: string
        data?: T
    }) {
        this.url = args?.url
        this.data = args?.data;
    }

    abstract fetchData(): T | Promise<T>
}

export class TemporaryImageAsset extends TemporaryAsset<Uint8Array>{

    data?: Uint8Array
    url: string
    constructor(readonly key: string, readonly hash: string, args?: {
        data?: Uint8Array
    }) {
        super(key, args)
        this.url = this.makeUrl(key)
    }

    makeUrl(key: string): string {
        // TODO -- replace this url as real one.
        const DEV_TEST_IMAGE = 'https://bridged-service-static.s3-us-west-1.amazonaws.com/branding/bridged-logo-512.png'
        return DEV_TEST_IMAGE
    }

    async fetchData(): Promise<Uint8Array> {
        if (this.data) {
            // if data exists, return it.
            return this.data
        }
        return await ImageRepositories.fetchDataByHash(this.hash)
    }
}


export class ImageRepository {
    images: Map<string, TemporaryImageAsset> = new Map<string, TemporaryImageAsset>();

    constructor(readonly buildId: string) {
    }

    exists(key: string): boolean {
        return this.images.has(key)
    }

    addImage(props: {
        key: string, hash: string, data?: Uint8Array
    }): TemporaryImageAsset {
        if (this.exists(props.key)) {
            console.warn('image you are tring to register to current build repository is already registered.', props.hash)
            return this.images[props.key]
        } else {
            // register image to repository images
            const newImage = new TemporaryImageAsset(props.key, props.hash);
            this.images[props.key] = newImage
            return newImage
        }
    }

    async hostImages() {
        // upload all images async
        const jobs: Array<Promise<any>> = []
        for (const key of this.images.keys()) {
            jobs.push(this.hostImage(key))
        }
        // wait for all images to be fetched from design. and uploaded to hosting server
        await Promise.all<Uint8Array>(jobs)
    }

    async hostImage(key: string) {
        const imageAsset: TemporaryImageAsset = this.images[key]
        const imageData = await imageAsset.fetchData()

        // TODO change to accept preserved-upload
        // const uploaded = await upload({
        //     file: imageData,
        //     name: key,
        // })
        // return uploaded.url
    }
}