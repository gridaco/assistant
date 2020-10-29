import { composeSimpleApplication, Widget } from "@bridged.xyz/flutter-builder";
import { upload } from "uguu-api"
import { compileComplete } from "dart-services"
function getConsoleQuicklookUrl(sourceUrl: string) {
    return `https://console.bridged.xyz/quicklook?url=${sourceUrl}`;
}

export async function quickLook(id: string, component: Widget) {
    console.log('quicklook starting..')
    const dartSource = composeSimpleApplication(component)
    const compiled = await compileComplete(dartSource)
    console.log('compiled!')
    const uploaded = await upload(`${id}.js`, compiled.result)
    console.log('uploaded!')
    const quicklookUrl = getConsoleQuicklookUrl(uploaded.url)
    open(quicklookUrl)
    console.log('launched!')
}