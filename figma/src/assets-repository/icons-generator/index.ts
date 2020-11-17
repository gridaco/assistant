import { IconConfig } from "@bridged.xyz/client-sdk/lib"
import Axios from "axios"
export function insertMaterialIcon(name: string, data: string): FrameNode {
    console.log(`inserting icon with name ${name} and data ${data}`)

    const currentViewportLocation = figma.viewport.center
    const node = figma.createNodeFromSvg(data)
    // todo replace naming creation with reflect core
    node.name = `icons/mdi_${name}`
    node.setSharedPluginData('icon', 'key', name)
    node.x = currentViewportLocation.x
    node.y = currentViewportLocation.y
    return node
}


export async function loadSvg(key: string, config: IconConfig): Promise<string> {
    // let header = new Headers({
    //     'Access-Control-Allow-Origin':'*',
    //     'Content-Type': 'multipart/form-data'
    // });
    // let sentData={
    //     method:'GET',
    //     mode: 'cors',
    //     header: header,
    // };

    const url = makeIconUrl(key, config)
    const raw = await (await Axios.get(url, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    })).data
    // const raw = await (await fetch(, sentData)).text()
    console.log(`icon raw data loaded for ${key}, length of ${raw.length}`)
    return raw
}

export function makeIconUrl(name: string, config: IconConfig): string {
    return `https://reflect-icons.s3-us-west-1.amazonaws.com/${config.host}/${name}.svg`
}