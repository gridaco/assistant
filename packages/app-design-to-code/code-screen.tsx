import React, { useEffect, useRef, useState } from "react";
import { Preview, utils } from "@ui/previewer";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import { DesigntoCodeUserOptions } from "./user-options";
import styled from "@emotion/styled";
import copy from "copy-to-clipboard";
import { PluginSdk } from "@plugin-sdk/app";
import { CodeScreenFooter } from "./footer-action/code-screen-footer";
import { useSingleSelection } from "plugin-app";
import { CodeViewWithControl } from "./code-view-with-control";
import * as repo_assets from "@design-sdk/asset-repository";
import { Resizable } from "re-resizable";
import { useScrollTriggeredAnimation } from "app/lib/components/motions";
import { useSetRecoilState } from "recoil";
import { hide_navigation } from "app/lib/main/global-state-atoms";
import bundler from "@code-editor/esbuild-services";
import { debounce } from "../_utils/debounce";

const resizeBarBase = 5;
const resizeBarVerPadding = 5;
const resizeBarSize = 5 + resizeBarVerPadding * 2;
const default_responsive_preview_height_for_code_screen = 300;

export function CodeScreen() {
  const selection = useSingleSelection();

  const [isBuilding, setIsBuilding] = useState(true);
  const [initialPreviewData, setInitialPreviewData] = useState<string>();
  const [esbuildPreviewData, setEsbuildPreviewData] = useState<string>();
  const [previewMode, setPreviewMode] =
    useState<"scaling" | "esbuild">("scaling");
  const [source, setSource] = useState<string>();
  const [app, setApp] = useState<string>();
  const [name, setName] = useState<string>();
  const [useroption, setUseroption] = useState<DesigntoCodeUserOptions>();

  const onCopyClicked = (e) => {
    copy(source);
    PluginSdk.notifyCopied();

    // ANALYTICS
    analytics.event_click_copy_code();
  };

  const handle_vanilla_preview_source = (
    v: string,
    r?: repo_assets.TransportableImageRepository
  ) => {
    setIsBuilding(false);
    setInitialPreviewData(utils.inject_assets_source_to_vanilla(v, r));
  };

  // ------------------------
  // ------ for esbuild -----

  useEffect(() => {
    // reset preview mode when switching framework
    setPreviewMode("scaling");
  }, [useroption?.framework]);

  const onCodeChangeHandler = debounce((code) => {
    handle_esbuild_preview_source(code);
  }, 500);

  const handle_esbuild_preview_source = (v: string) => {
    if (!initialPreviewData) {
      // the vanilla preview must be loaded first
      return;
    }
    const transform = (s, n) => {
      return `import React from 'react'; import ReactDOM from 'react-dom';
${s}
const App = () => <><${n}/></>
ReactDOM.render(<App />, document.querySelector('#root'));`;
    };

    if (useroption.framework == "react") {
      setIsBuilding(true);
      bundler({
        files: {
          "index.tsx": transform(v, name),
        },
        entry: "index.tsx",
      })
        .then((d) => {
          if (d.err == null) {
            if (d.code && d.code !== esbuildPreviewData) {
              setEsbuildPreviewData(d.code);
              setPreviewMode("esbuild");
            }
          }
        })
        .finally(() => {
          setIsBuilding(false);
        });
    }
  };
  // ------------------------

  // region scrolling handling -------------------
  const code_scrolling_area_ref = useRef<HTMLDivElement>(null);
  const set_hide_navigation_state = useSetRecoilState(hide_navigation);
  const hide = useScrollTriggeredAnimation(code_scrolling_area_ref);
  useEffect(() => {
    set_hide_navigation_state(hide);
  }, [hide]);
  // ---------------------------------------------

  const [previewHeight, setPreviewHeight] = useState<number>(
    default_responsive_preview_height_for_code_screen
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flexGrow: 1,
      }}
    >
      <div>
        <Resizable
          defaultSize={{
            width: "100%",
            height: `${default_responsive_preview_height_for_code_screen}px`,
          }}
          handleStyles={{
            bottom: {
              height: `${resizeBarSize}px`,
              bottom: `${Math.floor(-resizeBarSize / 2)}px`,
              zIndex: 1,
            },
          }}
          onResize={(e, d, el) => {
            setPreviewHeight(el.offsetHeight);
          }}
          handleComponent={{ bottom: ResizeWrap() }}
          enable={{
            top: false,
            right: false,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          minHeight="30px"
          // calc not supported.
          maxHeight="75vh"
        >
          <Preview
            key={selection?.id}
            type={previewMode}
            data={
              previewMode === "esbuild"
                ? esbuildPreviewData
                : initialPreviewData
            }
            id={selection?.id}
            origin_size={{
              width: selection?.node?.width,
              height: selection?.node?.height,
            }}
            isAutoSizable={true}
            height={previewHeight} //FIXME:
          />
        </Resizable>
      </div>
      <div
        ref={code_scrolling_area_ref}
        id="code-area"
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "auto",
          backgroundColor: "#1e1e1e",
        }}
      >
        <CopyCodeButton onClick={onCopyClicked}>
          <svg
            width="19"
            height="22"
            viewBox="0 0 19 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 0H0V16H2V2H14V0ZM19 4H4V22H19V4ZM17 20H6V6H17V20Z"
              fill="white"
            />
          </svg>
        </CopyCodeButton>
        <CodeViewWithControl
          key={selection?.id}
          targetid={selection?.id}
          onGeneration={({ name, app, src, vanilla_preview_source }) => {
            setName(name);
            setApp(app);
            setSource(src);
            handle_vanilla_preview_source(vanilla_preview_source);
          }}
          onCodeChange={onCodeChangeHandler}
          onAssetsLoad={(r) => {
            handle_vanilla_preview_source(initialPreviewData, r);
          }}
          onUserOptionsChange={setUseroption}
        />
      </div>
      <div>
        <CodeScreenFooter
          key={useroption?.framework}
          framework={useroption?.framework}
          app={app}
          scene={selection?.node as any}
        />
      </div>
    </div>
  );
}

const ResizeWrap = (props?: any) => (
  <ResizableHandleBar>{props}</ResizableHandleBar>
);

const CopyCodeButton = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 0;
  margin-top: 24px;
  margin-right: 20px;
  cursor: pointer;
  z-index: 1;
`;

const ResizableHandleBar = styled.div`
  width: 100%;
  z-index: 1;
  height: ${resizeBarBase}px;
  padding: ${resizeBarVerPadding}px 0;

  &:hover,
  &:active {
    padding: 0;
    margin-top: ${resizeBarVerPadding}px;
    height: ${resizeBarBase}px;
    background-color: #2663ff;
  }
`;
