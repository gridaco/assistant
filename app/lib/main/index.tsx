import * as React from "react";
import "../app.css";
import { initialize } from "../analytics";

// UI COMPS
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import { EK_SET_APP_MODE } from "../constants/ek.constant";
import { PluginApp } from "../utils/plugin-provider/pugin-app";
import BatchMetaEditor from "../pages/tool-box/batch-meta-editor";
import { BrowserRouter } from "react-router-dom";

//
// region screens import
import { FontReplacerScreen } from "../pages/tool-box/font-replacer";
import { ButtonMakerScreen } from "../pages/design/button-maker-screen";
import { ComponentViewScreen } from "../pages/component-view";
import { LayoutViewScreen } from "../pages/layout-view";
import { LintScreen } from "../pages/lint-screen";
import { GlobalizationScreen } from "../pages/g11n-screen";
import { IconsScreen } from "../pages/icons-screen";
import { CodeScreen } from "../pages/code/code-screen";
import { ToolboxScreen } from "../pages/tool-box";
import { MetaEditorScreen } from "../pages/tool-box/meta-editor";
import { ExporterScreen } from "../pages/tool-box/exporter";
import { DataMapperScreen } from "../pages/tool-box/data-mapper/data-mapper-screen";
import { TargetPlatform } from "../utils/plugin-init/init-target-platform";
import { AboutScreen } from "../pages/about";
// endregion screens import
//

import {
  getWorkmodeTabLayout,
  get_page_config,
  WorkMode,
  WorkScreen,
  worspaceModeToName,
  PrimaryWorkmodeSet,
} from "../navigation";

import {
  WorkmodeScreenTabs,
  PrimaryWorkmodeSelect,
  NavigatorExpansionControlButton,
} from "../components/navigation";
import styled from "@emotion/styled";

/** The container of tab content */
function TabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`app-tab-${index}`}
      // aria-labelledby={`tab-${type}`}
      {...other}
    >
      {value === index && <>{props.children}</>}
    </div>
  );
}

function WorkmodeSelect(props: {
  current: WorkMode;
  onSelect: (value: WorkMode) => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenWorkModeChangeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleWorkspaceModeSelect = (e) => {
    setAnchorEl(null);

    // when outside of menu is clicked, value is undefined -- so as the selected will be.
    let selected: WorkMode = e.target.value ?? props.current;
    // console.log("newly selected workspace mode is:", selected);

    props.onSelect(selected);
  };

  return (
    <div>
      <Button
        endIcon={<KeyboardArrowDown />}
        aria-controls="workspace-mode"
        aria-haspopup="true"
        onClick={handleOpenWorkModeChangeClick}
      >
        {worspaceModeToName(props.current)}
      </Button>
      <Menu
        id="workspace-mode"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleWorkspaceModeSelect}
        style={{ fontWeight: "bold" }}
      >
        {[
          WorkMode.code,
          WorkMode.design,
          WorkMode.content,
          WorkMode.toolbox,
          WorkMode.settings,
        ].map((w) => {
          return (
            <MenuItem onClick={handleWorkspaceModeSelect} value={w}>
              {worspaceModeToName(w)}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}

function Screen(props: { screen: WorkScreen }) {
  switch (props.screen) {
    case WorkScreen.about:
      return <AboutScreen />;
    case WorkScreen.code:
      return <CodeScreen />;
    case WorkScreen.component:
      return <ComponentViewScreen />;
    case WorkScreen.layout:
      return <LayoutViewScreen />;
    case WorkScreen.icon:
      return <IconsScreen />;
    case WorkScreen.lint:
      return <LintScreen />;
    case WorkScreen.dev:
      return <ToolboxScreen />;
    case WorkScreen.g11n:
      return <GlobalizationScreen />;
    case WorkScreen.exporter:
      return <ExporterScreen />;
    case WorkScreen.tool_desing_button_maker:
      return <ButtonMakerScreen />;
    case WorkScreen.tool_font_replacer:
      return <FontReplacerScreen />;
    case WorkScreen.tool_meta_editor:
      return <MetaEditorScreen />;
    case WorkScreen.tool_batch_meta_editor:
      return <BatchMetaEditor />;
    case WorkScreen.tool_data_mapper:
      return <DataMapperScreen />;
  }
}

function TabsLayout(props: {
  workmode: WorkMode;
  tabIndex: number;
  onChange: (index: number, tab: WorkScreen) => void;
}) {
  const { workmode, tabIndex, onChange } = props;
  const tabLayout = getWorkmodeTabLayout(workmode);
  const handleTabChange = (index: number) => {
    const screen = tabLayout[index];
    onChange(index, screen);
  };

  const tabs_as_page_configs = tabLayout.map((screen, index) => {
    const _ = get_page_config(screen);
    return {
      id: _.id,
      name: _.title,
    };
  });

  return (
    <div className="outer-ui">
      <div className="tabs-wrapper" style={{ margin: "0 -8px" }}>
        <WorkmodeScreenTabs
          layout={tabs_as_page_configs}
          tabIndex={tabIndex}
          onSelect={handleTabChange}
        />
      </div>

      {tabLayout.map((v, i) => {
        <TabPanel key={i} value={tabIndex} index={i}>
          <Screen screen={v} />
        </TabPanel>;
      })}
    </div>
  );
}

function TabNavigationApp() {
  const [workmode, setWorkmode] = React.useState<WorkMode>(WorkMode.code);
  const [workmodeSet, setWorkmodeSet] = React.useState<PrimaryWorkmodeSet>({
    first: WorkMode.code,
    second: WorkMode.design,
  });

  const on_workmode_select = (workmode: WorkMode) => {
    setWorkmode(workmode);
  };

  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const [expansion, setExpansion] = React.useState<boolean>(true);

  return (
    <>
      <Wrapper>
        <PrimaryWorkmodeSelect
          selection={workmode}
          set={workmodeSet}
          onSelect={on_workmode_select}
        />
        <NavigatorExpansionControlButton
          action={expansion ? "expand" : "close"}
          onClick={() => setExpansion(!expansion)}
        />
      </Wrapper>

      {/* LEGACY */}
      {/* <WorkmodeSelect
        current={workmode}
        onSelect={(selected) => {
          // when workspace mode is updated, by default the first index 0 tab will be selected without select event.
          // explicitly triggering the event.
          setWorkmode(selected);
          const newTabLayout = getWorkmodeTabLayout(selected);
          _update_focused_screen_ev(newTabLayout[0]);
        }}
      /> */}
      <TabsLayout
        workmode={workmode}
        tabIndex={tabIndex}
        onChange={(index, screen) => {
          _update_focused_screen_ev(screen);
          setTabIndex(index);
        }}
      />
    </>
  );
  //
}

export default function App(props: { platform: TargetPlatform }) {
  React.useEffect(() => {
    // FIXME: - dynamicallt change initial focused screen. (currently inital setup is not implemented. - initial setup is done by below line.)
    _update_focused_screen_ev(WorkScreen.code_flutter);

    // region init analytics
    try {
      initialize();
    } catch (e) {
      console.warn("Analytics disabled", e);
    }
    // endregion init GA
  }, []);

  return (
    <PluginApp platform={props.platform}>
      <BrowserRouter>
        <TabNavigationApp />
      </BrowserRouter>
    </PluginApp>
  );
}

function _update_focused_screen_ev(screen: WorkScreen) {
  // notify code.ts that app mode has set.
  parent.postMessage(
    {
      pluginMessage: {
        type: EK_SET_APP_MODE,
        data: screen,
      },
    },
    "*"
  );
  console.log(
    `sending back thread about changed screen (user interest) data - "${screen}"`
  );
}

const Wrapper = styled.div`
  display: flex;
`;
