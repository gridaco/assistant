import { composeSimpleApplication } from "@bridged.xyz/flutter-builder/lib/composer";
import { Widget } from "@bridged.xyz/flutter-builder/lib"
import { buildAndHostSimpleApp } from "@bridged.xyz/client-sdk/lib/build/flutter"

function getConsoleQuicklookUrl(sourceUrl: string) {
    return `https://console.bridged.xyz/quicklook?url=${sourceUrl}`;
}

export async function quickLook(id: string, component: Widget | string) {
    console.log('quicklook starting..')
    const dartSource = composeSimpleApplication(component)
    const url = await buildAndHostSimpleApp({
        dart: dartSource,
        id: id,
        short: true
    })
    console.log('compiled!')
    console.log('uploaded!')
    // const compiled = await compileComplete(dartSource)
    // const uploaded = await upload(`${id}.js`, new Blob([compiled.result]))
    const quicklookUrl = getConsoleQuicklookUrl(url)
    open(quicklookUrl)
    // console.log('launched!')
}