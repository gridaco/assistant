import * as React from "react";
import { initialize } from "../analytics";
import "../app.css";

// UI COMPS
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import { EK_SET_APP_MODE } from "../constants/ek.constant";
import { PluginApp } from "../utils/plugin-provider/pugin-app";
import BatchMetaEditor from "../pages/tool-box/batch-meta-editor";
import { BrowserRouter } from "react-router-dom";

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
import { UploadSteps } from "../components/upload-steps";
import {
  getWorkmodeTabLayout,
  WorkMode,
  WorkScreen,
  workScreenToName,
  worspaceModeToName,
} from "../navigation";

// endregion screens import

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
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

function a11yProps(index: number) {
  return {
    id: `app-tab-${index}`,
    // 'aria-controls': `tab-${mode}`,
  };
}

export default function App(props: { platform: TargetPlatform }) {
  React.useEffect(() => {
    // todo - dynamicallt change initial focused screen. (currently inital setup is not implemented. - initial setup is done by below line.)
    updateFocusedScreen(WorkScreen.code_flutter);

    // region init analytics
    try {
      initialize();
    } catch (e) {
      console.warn("GA disabled", e);
    }
    // endregion init GA
  }, []);

  const [workspaceMode, setWorkspaceMode] = React.useState<WorkMode>(
    WorkMode.code
  );
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const handleOpenWorkModeChangeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleWorkspaceModeSelect = (e) => {
    setAnchorEl(null);

    console.log("workspace mode menu clicked e:", e.target.value as WorkMode);
    let selected: WorkMode = e.target.value;
    console.log("newly selected workspace mode is:", selected);

    // when outside of menu is clicked, value is undefined -- so as the selected will be.
    if (selected === undefined) {
      selected = workspaceMode;
    }

    setWorkspaceMode(selected);

    // when workspace mode is updated, by default the first index 0 tab will be selected without select event.
    // explicitly triggering the event.
    const newTabLayout = getWorkmodeTabLayout(selected);
    updateFocusedScreen(newTabLayout[0]);
  };

  const handleIsUploading = () => {
    setIsUploading(!isUploading);
  };

  const updateFocusedScreen = (screen: WorkScreen) => {
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
  };

  function makeTabLayout(workspaceMode: WorkMode) {
    const tabLayout = getWorkmodeTabLayout(workspaceMode);
    const handleTabChange = (event, index: number) => {
      const screen = tabLayout[index];
      updateFocusedScreen(screen);
      setTabIndex(index);
    };

    const tabs = (
      <Tabs
        value={tabIndex}
        variant="standard"
        scrollButtons="off"
        onChange={handleTabChange}
        aria-label="primary tab"
      >
        {tabLayout.map((v, i) => {
          return (
            <Tab
              key={v}
              label={workScreenToName(v)}
              {...a11yProps(i)}
              style={{ textTransform: "capitalize" }}
            />
          );
        })}
      </Tabs>
    );

    const panels = (
      <>
        {tabLayout.map((v, i) => {
          switch (v) {
            case WorkScreen.about:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <AboutScreen />
                </TabPanel>
              );
            case WorkScreen.code:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <CodeScreen handleIsUploading={handleIsUploading} />
                </TabPanel>
              );
            case WorkScreen.component:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <ComponentViewScreen />
                </TabPanel>
              );
            case WorkScreen.layout:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <LayoutViewScreen />
                </TabPanel>
              );
            case WorkScreen.icon:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <IconsScreen />
                </TabPanel>
              );
            case WorkScreen.lint:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <LintScreen />
                </TabPanel>
              );
            case WorkScreen.dev:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <ToolboxScreen />
                </TabPanel>
              );
            case WorkScreen.g11n:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <GlobalizationScreen />
                </TabPanel>
              );
            case WorkScreen.exporter:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <ExporterScreen />
                </TabPanel>
              );
            case WorkScreen.desing_button_maker:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <ButtonMakerScreen />
                </TabPanel>
              );
            case WorkScreen.tool_font_replacer:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <FontReplacerScreen />
                </TabPanel>
              );
            case WorkScreen.tool_meta_editor:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <MetaEditorScreen />
                </TabPanel>
              );
            case WorkScreen.tool_batch_meta_editor:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <BatchMetaEditor />
                </TabPanel>
              );
            case WorkScreen.tool_data_mapper:
              return (
                <TabPanel key={i} value={tabIndex} index={i}>
                  <DataMapperScreen />
                </TabPanel>
              );
          }
        })}
      </>
    );

    return (
      <div className="outer-ui">
        <div className="tabs-wrapper" style={{ margin: "0 -8px" }}>
          {tabs}
        </div>

        {panels}
      </div>
    );
  }

  function makeWorkspaceModeSelect() {
    return (
      <div>
        <Button
          endIcon={<KeyboardArrowDown />}
          aria-controls="workspace-mode"
          aria-haspopup="true"
          onClick={handleOpenWorkModeChangeClick}
        >
          {worspaceModeToName(workspaceMode)}
        </Button>
        <Menu
          id="workspace-mode"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleWorkspaceModeSelect}
          style={{ fontWeight: "bold" }}
        >
          <MenuItem onClick={handleWorkspaceModeSelect} value={WorkMode.code}>
            CODE
          </MenuItem>
          <MenuItem onClick={handleWorkspaceModeSelect} value={WorkMode.design}>
            DESIGN
          </MenuItem>
          <MenuItem
            onClick={handleWorkspaceModeSelect}
            value={WorkMode.content}
          >
            CONTENT
          </MenuItem>
          <MenuItem
            onClick={handleWorkspaceModeSelect}
            value={WorkMode.toolbox}
          >
            TOOLS
          </MenuItem>
          <MenuItem
            onClick={handleWorkspaceModeSelect}
            value={WorkMode.settings}
          >
            ABOUT
          </MenuItem>
        </Menu>
      </div>
    );
  }

  const screenLayout = makeTabLayout(workspaceMode);
  const workspaceModeSelectLayout = makeWorkspaceModeSelect();

  return (
    <PluginApp platform={props.platform}>
      <BrowserRouter>
        {isUploading ? (
          <UploadSteps />
        ) : (
          <>
            {workspaceModeSelectLayout}
            {screenLayout}
          </>
        )}
      </BrowserRouter>
    </PluginApp>
  );
}
