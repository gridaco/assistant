import React, { useEffect, useState } from "react"
import { IconConfig } from "@bridged.xyz/client-sdk/lib"
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { EK_CREATE_ICON } from "../constants/ek.constant";
import { loadSvg, makeIconUrl } from "../../assets-repository/icons-generator";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
const CONFIG_JSON_S3 = "https://reflect-icons.s3-us-west-1.amazonaws.com/material/config.json"


// cached icons configs
let CONFIGS: Map<string, IconConfig>
export function IconsLoader() {
    const [configs, setConfigs] = useState<Map<string, IconConfig>>(undefined);
    const [queryTerm, setQueryTerm] = useState<string>(undefined);

    useEffect(() => {
        if (CONFIGS) {
            setConfigs(CONFIGS)
        } else {
            fetch(CONFIG_JSON_S3)
                .then((response) => response.json())
                .then((json) => {
                    CONFIGS = json
                    setConfigs(json)
                })
        }
    }, []);


    let list;
    if (configs) {
        const MAX_PER_LOAD = 100
        const validQueryTerm = queryTerm !== undefined && queryTerm.length >= 2
        const searchOnlyDefaults: boolean = !validQueryTerm
        const defaultIcons = filterIcons(configs, {
            onlyDefault: searchOnlyDefaults,
            includes: validQueryTerm ? queryTerm : undefined
        }).slice(0, MAX_PER_LOAD)
        list = <IconList icons={defaultIcons} />
    } else {
        list = <LinearProgress />
    }

    return (
        <>
            <IconSearch onChange={setQueryTerm} />
            {list}
        </>
    )
}

function IconSearch(props: {
    onChange: (value: string) => void
}) {
    return (
        <TextField id="standard-basic" label="search with icon name" onChange={(e) => props.onChange(e.target.value)} />
    )
}

function filterIcons(configs: Map<string, IconConfig>, options: {
    onlyDefault: boolean,
    includes?: string
}): [string, IconConfig][] {
    const keys = Object.keys(configs)
    const defaultIcons = keys.map<[string, IconConfig]>((k) => {
        const item = configs[k] as IconConfig
        if (options.onlyDefault) {
            if (item.variant != 'default') {
                return undefined
            }
        }

        if (options.includes) {
            if (k.includes(options.includes)) {
                return [k, item]
            } else {
                return
            }
        }
        return [k, item]

    }).filter((k) => k !== undefined)
    console.log('default icons', defaultIcons.length)
    return defaultIcons
}

function IconList(props: {
    icons: [string, IconConfig][]
}) {
    const { icons } = props

    return <>
        <GridList cellHeight={160} cols={5}>
            {
                icons.map((i) => {
                    const key = i[0]
                    const config = i[1]
                    return <GridListTile key={key}>
                        <IconItem key={key} name={key} config={config} />
                    </GridListTile>
                })
            }
        </GridList>
    </>
}

function IconItem(props: {
    name: string,
    config: IconConfig
}) {
    const { name, config } = props

    const onClick = () => {
        console.log(name, 'clicked')
        loadSvg(name, config).then((s) => {
            console.log('postmessage', EK_CREATE_ICON)
            parent.postMessage({
                pluginMessage: {
                    type: EK_CREATE_ICON,
                    data: {
                        key: name,
                        svg: s
                    }
                }
            }, "*")
        })
    }

    return <div>
        <Tooltip title={`${name} (${config.variant})`}>
            <IconButton aria-label="delete" onClick={onClick}>
                <svg width="24" height="24">
                    <image xlinkHref={makeIconUrl(name, config)} width="24" height="24" />
                </svg>
            </IconButton>
        </Tooltip>
    </div>
}