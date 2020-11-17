import React, { useEffect, useState } from "react"
import { IconConfig } from "@bridged.xyz/client-sdk/lib"
const CONFIG_JSON_S3 = "https://reflect-icons.s3-us-west-1.amazonaws.com/material/config.json"

function makeIconUrl(name: string, config: IconConfig): string {
    return `https://reflect-icons.s3-us-west-1.amazonaws.com/${config.host}/${name}.svg`
}

export function IconsLoader() {
    const [config, setConfig] = useState<Map<string, IconConfig>>(undefined);

    useEffect(() => {
        fetch(CONFIG_JSON_S3)
            .then((response) => response.json())
            .then((json) => {
                setConfig(json)
            })
    }, []);

    const list = config ? <IconList configs={config} /> : <p>loading configuration...</p>

    return (
        <>
            {list}
        </>
    )

}

function IconSearch() {
    return <input>type</input>
}


function IconList(props: {
    configs: Map<string, IconConfig>
}) {
    const { configs } = props
    const keys = Object.keys(configs).slice(0, 100)
    return <>
        {
            keys.map((k) => {
                const item = configs[k] as IconConfig
                return <IconItem key={k} name={k} config={item} />

            })
        }
    </>
}

function IconItem(props: {
    name: string,
    config: IconConfig
}) {
    const { name, config } = props
    return <div>
        <svg width="24" height="24">
            <image xlinkHref={makeIconUrl(name, config)} width="24" height="24" />
        </svg>
        <p> {config.host}</p>
    </div>
}