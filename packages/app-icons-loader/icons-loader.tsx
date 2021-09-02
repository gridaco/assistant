import React, { useEffect, useState } from "react";
import { icons } from "@base-sdk/resources";
import { IconConfig } from "@reflect-ui/core/lib";
import Tooltip from "@material-ui/core/Tooltip";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import {
  EK_CREATE_ICON,
  EK_ICON_DRAG_AND_DROPPED,
} from "@core/constant/ek.constant";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles, Select, MenuItem, InputBase } from "@material-ui/core";
import { Search } from "@material-ui/icons";
const CONFIG_JSON_S3 =
  "https://reflect-icons.s3-us-west-1.amazonaws.com/all.json";
import { Draggable } from "@plugin-sdk/draggable";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import styled from "@emotion/styled";

// cached icons configs
let CONFIGS: Map<string, IconConfig>;
export function IconsLoader() {
  const [configs, setConfigs] = useState<Map<string, IconConfig>>(undefined);
  const [queryTerm, setQueryTerm] = useState<string>(undefined);
  const [iconLoadLimit, setIconLoadLimit] = useState(100);
  const [iconProperty, setIconProperty] = useState<IconConfig>({
    default_size: "size",
    variant: "variant",
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

  useEffect(() => {
    setIconLoadLimit(100);
  }, [iconProperty, queryTerm]);

  let list;
  if (configs) {
    const validQueryTerm = queryTerm !== undefined && queryTerm.length >= 1;
    // const searchOnlyDefaults: boolean = !validQueryTerm
    const defaultIcons = filterIcons(configs, {
      includes: validQueryTerm ? queryTerm : undefined,
    }).reduce((acc: any[], cur: any) => {
      if (
        iconProperty.default_size === "size" &&
        iconProperty.variant === "variant"
      ) {
        acc.push(cur);
      } else if (
        iconProperty.default_size === "size" &&
        cur[1].variant === iconProperty.variant
      ) {
        acc.push(cur);
      } else if (
        iconProperty.variant === "variant" &&
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
    }, []);

    const icons = sort_icon(defaultIcons as [string, any]).slice(
      0,
      iconLoadLimit
    );
    list = <IconList icons={icons} />;
  } else {
    list = <StyledLinearProgress />;
  }

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      setIconLoadLimit(iconLoadLimit + 100);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

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
    default_size: ["Size", "16", "20", "24", "28", "32"],
    variant: ["Variant", "Outlined", "Twotone", "Default", "Sharp"],
  };
  const [iconProperty, setIconProperty] = useState({
    default_size: "Size",
    variant: "Variant",
  });

  const BootstrapInput = withStyles((theme) => ({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      fontSize: 14,
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
    <Wrapper>
      <SearchBar>
        <Search style={{ fontSize: "20px" }} />
        <Input
          placeholder="Search with icon name"
          onChange={(e) => props.onChange(e.target.value.toLocaleLowerCase())}
        />
      </SearchBar>
      <SearchChecker>
        <TypeCheck>
          <StyledSelect
            classes={{ root: "root" }}
            value={iconProperty.variant}
            onChange={(e) => onSelectValue("variant", e.target.value)}
            input={<BootstrapInput classes={{ root: "root" }} />}
          >
            {iconPropertyList.variant.map((i) => (
              <MenuItem value={i}>{i}</MenuItem>
            ))}
          </StyledSelect>
        </TypeCheck>
        <SizeCheck>
          <StyledSelect
            classes={{ root: "root" }}
            id="demo-customized-select-native"
            value={iconProperty.default_size}
            onChange={(e) => onSelectValue("size", e.target.value)}
            input={<BootstrapInput />}
          >
            {iconPropertyList.default_size.map((i) => (
              <MenuItem value={i}>
                {i === "Size" ? "Size" : i + " x " + i}
              </MenuItem>
            ))}
          </StyledSelect>
        </SizeCheck>
      </SearchChecker>
    </Wrapper>
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
  console.log("default icons loaded", defaultIcons.length);
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
            <GridItem key={key} classes={{ tile: "tile" }}>
              <IconItem key={key} name={key} config={config} />
            </GridItem>
          );
        })}
      </GridList>
    </>
  );
}

function IconItem(props: { name: string; config: IconConfig }) {
  const { name, config } = props;
  const [downloading, setDownloading] = useState<boolean>(false);

  const _onUserLoadIconToCanvas = () => {
    // ANALYTICS
    analytics.event_load_icon({
      icon_name: props.name,
    });
  };

  async function loadData() {
    _onUserLoadIconToCanvas();
    try {
      setDownloading(true);
      const svg = await icons.loadSvg(name, config);
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
    _onUserLoadIconToCanvas();
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
        <IconButton onClick={onClick} disabled={downloading}>
          {downloading ? (
            <CircularProgress size={24} />
          ) : (
            <svg width="24" height="24">
              <image
                xlinkHref={icons.makeIconUrl(name, config)}
                width="24"
                height="24"
              />
            </svg>
          )}
        </IconButton>
      </Tooltip>
    </Draggable>
  );
}

/**
 * sorts icons with below logic
 * 1. sort a-z first
 * 2. sort number later
 *
 * e.g. ["a", "b", "1", "2", "1a", "a1"]
 * -> ["a", "a1", "b", "1", "1a", "2"]
 */
function sort_icon(icons: [string, any]) {
  const _contains_number_char = (c) => {
    return "0123456789".includes(c[0] ?? "");
  };
  return icons.sort((_i, _i2) => {
    const i = _i[0];
    const i2 = _i2[0];
    if (_contains_number_char(i) && _contains_number_char(i2)) {
      return Number(i) - Number(i2);
    } else if (_contains_number_char(i) && !_contains_number_char(i2)) {
      return 1;
    } else if (!_contains_number_char(i) && _contains_number_char(i2)) {
      return -1;
    } else if (!_contains_number_char(i) && !_contains_number_char(i2)) {
      if (i < i2) {
        return -1;
      }
      if (i > i2) {
        return 1;
      }
      return 0;
    }
  });
}

const Wrapper = styled.div`
  padding-top: 14px;
  padding-bottom: 15px;
  position: relative;
`;

const SearchBar = styled.div`
  width: 100%;
  font-size: 14px;
  height: 55px;
  display: flex;
  align-items: center;

  svg {
    margin: 10px;
    margin-left: 8px;
    font-size: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 90%;
  border: none;
  outline: none;

  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: #adaeb2;

  &::placeholder {
    color: #adaeb2;
  }
`;

const SearchChecker = styled.div`
  height: 55px;
  width: 100%;
  display: flex;
`;

const TypeCheck = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  cursor: pointer;
  padding: 0px 16px;
`;

const StyledSelect = styled(Select)`
  width: 100% !important;
  &.root {
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
  }
`;

const SizeCheck = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0px 16px;
`;

const StyledLinearProgress = styled(LinearProgress)`
  /* for reset body margin */

  /* reset material-ui style */
  &.color-primary {
    background-color: #ecf1ff;
  }

  &.barColorPrimary {
    background-color: #2562ff;
  }
`;

const GridItem = styled(GridListTile)`
  height: 70px !important;
  display: flex;
  align-items: center;
  justify-content: center;

  &.tile {
    height: auto;
  }
`;

const IconButton = styled.button`
  background-color: #fff;
  border: none;
  height: 48px !important;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #eeeeee;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.25s;
  }
`;
