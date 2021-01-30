import React, { useEffect, useState } from "react";
import { loadSvg, makeIconUrl } from "@bridged.xyz/client-sdk/lib";
import { IconConfig } from "@reflect.bridged.xyz/core/lib";
import Tooltip from "@material-ui/core/Tooltip";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import {
  EK_CREATE_ICON,
  EK_ICON_DRAG_AND_DROPPED,
} from "../constants/ek.constant";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles, Select, MenuItem, InputBase } from "@material-ui/core";
import { Search } from "@material-ui/icons";
const CONFIG_JSON_S3 =
  "https://reflect-icons.s3-us-west-1.amazonaws.com/all.json";
import "./icons-loader.css";
import { Draggable } from "../utils/draggable";

// cached icons configs
let CONFIGS: Map<string, IconConfig>;
export function IconsLoader() {
  const [configs, setConfigs] = useState<Map<string, IconConfig>>(undefined);
  const [queryTerm, setQueryTerm] = useState<string>(undefined);
  const [iconProperty, setIconProperty] = useState<IconConfig>({
    default_size: "all",
    variant: "all",
    host: "material",
  });

  useEffect(() => {
    if (CONFIGS) {
      setConfigs(CONFIGS);
    } else {
      fetch(CONFIG_JSON_S3)
        .then((response) => response.json())
        .then((json) => {
          CONFIGS = json;
          setConfigs(json);
        });
    }
  }, []);

  let list;
  if (configs) {
    const MAX_PER_LOAD = 100;
    const validQueryTerm = queryTerm !== undefined && queryTerm.length >= 1;
    // const searchOnlyDefaults: boolean = !validQueryTerm
    const defaultIcons = filterIcons(configs, {
      includes: validQueryTerm ? queryTerm : undefined,
    })
      .reduce((acc: any[], cur: any) => {
        if (
          iconProperty.default_size === "all" &&
          iconProperty.variant === "all"
        ) {
          acc.push(cur);
        } else if (
          iconProperty.default_size === "all" &&
          cur[1].variant === iconProperty.variant
        ) {
          acc.push(cur);
        } else if (
          iconProperty.variant === "all" &&
          cur[1].default_size === iconProperty.default_size
        ) {
          acc.push(cur);
        } else if (
          cur[1].default_size === iconProperty.default_size &&
          cur[1].variant === iconProperty.variant
        ) {
          acc.push(cur);
        }
        return acc;
      }, [])
      .slice(0, MAX_PER_LOAD);

    list = <IconList icons={defaultIcons} />;
  } else {
    list = <LinearProgress />;
  }

  return (
    <>
      <IconSearch
        onChange={setQueryTerm}
        onSelectIconProperty={setIconProperty}
      />
      {list}
    </>
  );
}

function IconSearch(props: {
  onChange: (value: string) => void;
  onSelectIconProperty: (value: any) => void;
}) {
  const iconPropertyList = {
    default_size: ["All", "16", "20", "24", "28", "32"],
    variant: ["All", "Outlined", "Twotone", "Default", "Sharp"],
  };
  const [iconProperty, setIconProperty] = useState({
    default_size: "All",
    variant: "All",
  });

  const BootstrapInput = withStyles((theme) => ({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      fontSize: 16,
    },
  }))(InputBase);

  const onSelectValue = (type: string, value: any) => {
    if (type === "size") {
      props.onSelectIconProperty((d) => ({
        ...d,
        default_size: value.toLocaleLowerCase(),
      }));
      setIconProperty((d) => ({
        ...d,
        default_size: value,
      }));
    } else if (type === "variant") {
      props.onSelectIconProperty((d) => ({
        ...d,
        variant: value.toLocaleLowerCase(),
      }));
      setIconProperty((d) => ({
        ...d,
        variant: value,
      }));
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <Search />
        <input
          placeholder="Search with icon name"
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
      <div className="search-container-checker">
        <div className="type-checker">
          <Select
            style={{ width: "100%" }}
            value={iconProperty.variant}
            onChange={(e) => onSelectValue("variant", e.target.value)}
            input={<BootstrapInput />}
          >
            {iconPropertyList.variant.map((i) => (
              <MenuItem value={i}>{i}</MenuItem>
            ))}
          </Select>
        </div>
        <div className="size-checker">
          <Select
            style={{ width: "100%" }}
            id="demo-customized-select-native"
            value={iconProperty.default_size}
            onChange={(e) => onSelectValue("size", e.target.value)}
            input={<BootstrapInput />}
          >
            {iconPropertyList.default_size.map((i) => (
              <MenuItem value={i}>
                {i === "All" ? "All" : i + " x " + i}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

function filterIcons(
  configs: Map<string, IconConfig>,
  options: {
    includes?: string;
  }
): [string, IconConfig][] {
  const keys = Object.keys(configs);
  const defaultIcons = keys
    .map<[string, IconConfig]>((k) => {
      const item = configs[k] as IconConfig;

      if (options.includes) {
        if (k.includes(options.includes)) {
          return [k, item];
        } else {
          return;
        }
      }
      return [k, item];
    })
    .filter((k) => k !== undefined);
  console.log("default icons", defaultIcons.length);
  return defaultIcons;
}

function IconList(props: { icons: [string, IconConfig][] }) {
  const { icons } = props;

  return (
    <>
      <GridList cellHeight="auto" cols={5}>
        {icons.map((i) => {
          const key = i[0];
          const config = i[1];
          return (
            <GridListTile className="grid-item" key={key}>
              <IconItem key={key} name={key} config={config} />
            </GridListTile>
          );
        })}
      </GridList>
    </>
  );
}

function IconItem(props: { name: string; config: IconConfig }) {
  const { name, config } = props;
  const [downloading, setDownloading] = useState<boolean>(false);

  async function loadData() {
    try {
      setDownloading(true);
      const svg = await loadSvg(name, config);
      const data = {
        key: name,
        svg: svg,
        config: config,
      };
      return data;
    } catch (_) {
      throw _;
    } finally {
      setDownloading(false);
    }
  }

  const onClick = () => {
    console.log(name, "clicked");
    loadData().then((d) => {
      parent.postMessage(
        {
          pluginMessage: {
            type: EK_CREATE_ICON,
            data: d,
          },
        },
        "*"
      );
    });
  };

  return (
    <Draggable customDataLoader={loadData} eventKey={EK_ICON_DRAG_AND_DROPPED}>
      <Tooltip
        title={`${name} (${config.variant}) (${config.host})`}
        placement="top"
        PopperProps={{
          popperOptions: {
            modifiers: {
              offset: {
                offset: "-1px, -20px",
              },
            },
          },
        }}
      >
        <button
          className="icon-button"
          onClick={onClick}
          disabled={downloading}
        >
          {downloading ? (
            <CircularProgress size={24} />
          ) : (
            <svg width="24" height="24">
              <image
                xlinkHref={makeIconUrl(name, config)}
                width="24"
                height="24"
              />
            </svg>
          )}
        </button>
      </Tooltip>
    </Draggable>
  );
}
