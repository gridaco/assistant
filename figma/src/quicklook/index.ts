import { composeAppWithHome, } from "@bridged.xyz/flutter-builder/lib/composer";
import { Widget } from "@bridged.xyz/flutter-builder/lib"
import { buildConsoleQuicklookUrl } from "@bridged.xyz/client-sdk/lib/projects/quicklook"
import { upload } from "@bridged.xyz/client-sdk/lib/hosting";


export async function quickLook(id: string, app: Widget | string) {
    console.log('quicklook starting..')
    const dartSource = composeAppWithHome(app)
    console.info('the final app code for quicklook is...', dartSource)
    const uploaded = await upload({
        file: dartSource,
        name: id
    })
    const url = uploaded.url
    // const url = await buildAndHostSimpleApp({
    //     dart: dartSource,
    //     id: id,
    //     short: true
    // })
    console.log('uploaded!')
    // const compiled = await compileComplete(dartSource)
    // const uploaded = await upload(`${id}.js`, new Blob([compiled.result]))
    const quicklookUrl = buildConsoleQuicklookUrl({
        id: id,
        name: 'flutter-example',
        framework: "flutter",
        language: "dart",
        url: url,
    })
    open(quicklookUrl)
    // console.log('launched!')
}