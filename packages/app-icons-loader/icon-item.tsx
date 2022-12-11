import React, { useEffect, useRef, useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import {
  EK_CREATE_ICON,
  EK_ICON_DRAG_AND_DROPPED,
} from "@core/constant/ek.constant";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Draggable } from "@plugin-sdk/draggable";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import styled from "@emotion/styled";
import { IconMeta, Icon, loadSvg, makeIconUrl, useIcons } from "./resources";

type IconItemProps = Icon & { onClick: () => void };

export function IconItem({ onClick, ...props }: IconItemProps) {
  const { package: _package, name, variant } = props;
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const _aid = name + " " + variant; // id for analytics

  useEffect(() => {
    setTimeout(() => {
      setLoading(!loaded);
    }, 5);
  }, [loaded]);

  const _onUserLoadIconToCanvas = () => {
    // ANALYTICS
    analytics.event_load_icon({
      icon_name: _aid,
    });
  };

  async function loadData() {
    _onUserLoadIconToCanvas();
    try {
      setDownloading(true);
      const svg = await loadSvg(props, {
        disable_cache: true,
      });
      const data = {
        key: name,
        svg: svg,
        config: {
          name: props.name,
          variant: props.variant,
          size: props.size,
          package: props.package,
        },
      };
      return data;
    } catch (_) {
      throw _;
    } finally {
      setDownloading(false);
    }
  }

  const onclick = () => {
    onClick();
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
        title={`${name} (${variant ?? "default"}) (${_package})`}
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
        <IconButton onClick={onclick} disabled={downloading}>
          {downloading ? (
            <CircularProgress size={24} />
          ) : (
            <svg
              width="24"
              height="24"
              style={{
                borderRadius: 4,
                background: loading ? "rgba(0, 0, 0, 0.1)" : "none",
                transition: "background 0.3s",
              }}
            >
              <image
                className="unicons"
                xlinkHref={makeIconUrl(props)}
                onLoad={() => setLoaded(true)}
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
