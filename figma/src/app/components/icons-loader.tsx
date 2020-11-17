import React, { useEffect, useState } from "react"

const CONFIG_JSON_S3 = "https://reflect-icons.s3-us-west-1.amazonaws.com/material/config.json"

interface IconConfig {
    default_size: string
    variant: "outlined" | "outlined" | "twotone" | "default" | "default" | "sharp"
    family?: string
    host: "material"
}

export function IconsLoader() {
    const [config, setConfig] = useState<Array<IconConfig>>(undefined);


    fetch(CONFIG_JSON_S3)
        .then((response) => response.json())
        .then((json) => {
            setConfig(json)
        })

    return (<p>a</p>)
}