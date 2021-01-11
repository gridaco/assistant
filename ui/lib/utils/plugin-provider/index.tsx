import React from "react"
import Axios from "axios"
import { NetworkRequest, PLC_REMOTE_API_REQ, PLC_REMOTE_API_RES } from "./events"


export function PluginConsumer(props: {
    children: any
}) {

    window.addEventListener('message', (ev: MessageEvent) => {
        const message = ev.data.pluginMessage
        if (message.type == PLC_REMOTE_API_REQ) {
            // call remote request
            const requestManifest = message.data as NetworkRequest
            Axios.request({
                method: requestManifest.method,
                url: requestManifest.url,
                data: requestManifest.data,
                headers: requestManifest.headers
            }).then(r => {
                networkResponseToCodeThread(window, requestManifest.requestId, r.data)
            }).catch(e => {
                networkResponseToCodeThread(window, requestManifest.requestId, null, e)
            })
        }
    })

    console.log('pugin consumer initiallized')
    return <div>
        {props.children}
    </div>
}


function networkResponseToCodeThread(window: Window, requestId: string, data: any, error: any = undefined) {
    if (error) {
        window.postMessage({
            pluginData: {
                type: PLC_REMOTE_API_RES,
                data: {
                    requestId: requestId,
                    error: error
                }
            }
        }, "*")
        return
    }

    window.postMessage({
        pluginData: {
            type: PLC_REMOTE_API_RES,
            data: {
                requestId: requestId,
                ...data
            }
        }
    }, "*")
}