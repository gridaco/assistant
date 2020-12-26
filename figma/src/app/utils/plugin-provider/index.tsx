import React from "react"

const PLC_REMOTE_API_REQ = "pugin-consumer/remote-api/request"
const PLC_REMOTE_API_RES = "pugin-consumer/remote-api/response"

export function PluginConsumer(props: {
    children: any
}) {

    window.addEventListener('message', (ev: MessageEvent) => {
        const message = ev.data.pluginMessage
        if (message.type == PLC_REMOTE_API_REQ) {
            // call remote request
        }
        // console.log('message recieved from plugin consumer', message)
    })

    console.log('pugin consumer initiallized')
    return <div>
        {props.children}
    </div>
}