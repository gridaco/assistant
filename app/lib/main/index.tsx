import React, { useState, useEffect } from "react";
import "../app.css";
import { initialize } from "../analytics";

// UI COMPS
import { EK_SET_APP_MODE } from "../constants/ek.constant";
import { PluginApp } from "plugin-app";
import BatchMetaEditor from "../pages/tool-box/batch-meta-editor";
import { useHistory, Switch, Route } from "react-router-dom";

//
// region screens import
import { FontReplacerScreen } from "../pages/tool-box/font-replacer";
import { ButtonMakerScreen } from "../pages/design/button-maker-screen";
import { ComponentViewScreen } from "../pages/component-view";
import { LayoutViewScreen } from "../pages/layout-view";
import { LintScreen } from "../pages/lint/lint-screen";
import { GlobalizationScreen } from "../pages/g11n-screen";
import { IconsScreen } from "../pages/icons-screen";
import { CodeScreen } from "../pages/code/code-screen";
import { ToolboxScreen } from "../pages/tool-box";
import { MetaEditorScreen } from "../pages/tool-box/meta-editor";
import { ExporterScreen } from "../pages/tool-box/exporter";
import { DataMapperScreen } from "../pages/tool-box/data-mapper/data-mapper-screen";
import { TargetPlatform } from "../utils/plugin-init/init-target-platform";
import { AboutScreen } from "../pages/about";
import Signin from "../pages/signin";
// endregion screens import
//

import {
  getDedicatedRouter,
  getWorkmodeTabLayout,
  get_page_config,
  WorkMode,
  WorkScreen,
  standalone_pages,
  PrimaryWorkmodeSet,
  loadLayout,
  NavigationStoreState,
} from "../navigation";

import {
  WorkmodeScreenTabs,
  PrimaryWorkmodeSelect,
  NavigatorExpansionControlButton,
  SecondaryWorkmodeMenu,
} from "../components/navigation";
import styled from "@emotion/styled";
import { Column, Row } from "../components/style/global-style";
import { UploadSteps } from "../components/upload-steps";
import { FixYourSelf } from "../pages/lint/fix-your-self";

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

function DropNav() {
  const menu = [
    // {
    //   id: WorkMode.code,
    //   name: WorkMode.code,
    // },
    // {
    //   id: WorkMode.design,
    //   name: WorkMode.design,
    // },
    {
      id: WorkMode.asset,
      name: WorkMode.asset,
    },
    {
      id: WorkMode.manage,
      name: WorkMode.manage,
    },
    {
      id: WorkMode.tools,
      name: WorkMode.tools,
    },
    {
      id: WorkMode.library,
      name: WorkMode.library,
    },
    {
      id: WorkMode.settings,
      name: WorkMode.settings,
    },
    {
      id: WorkMode.about,
      name: WorkMode.about,
    },
  ];
  return <SecondaryWorkmodeMenu menus={menu} onSelect={() => {}} />;
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
    case WorkScreen.scene_upload_steps_final:
      return <UploadSteps />;
    case WorkScreen.signin:
      return <Signin />;
    case WorkScreen.lint_fix_yourself:
      return <FixYourSelf />;
    default:
      return <div>Not found</div>;
  }
}

function TabsLayout(props: {
  workmode: WorkMode;
  tabIndex: number;
  isTabVisible: boolean;
  onChange: (index: number, tab: WorkScreen) => void;
}) {
  const history = useHistory();
  const { workmode, tabIndex, onChange } = props;
  const tabs_as_page_configs = getWorkmodeTabLayout(workmode).map(
    (screen, index) => {
      const _ = get_page_config(screen);
      return {
        id: _.id,
        name: _.title,
        path: _.path,
      };
    }
  );

  const handleTabChange = (index: number) => {
    const screen = tabs_as_page_configs[index];
    onChange(index, screen.id);
    history.replace(screen.path); // since it is a movement between tabs, we don't use push. we use replace to avoid the history stack to be too long.
  };

  return (
    <div className="outer-ui">
      {props.isTabVisible && (
        <div className="tabs-wrapper" style={{ margin: "0 -8px" }}>
          <WorkmodeScreenTabs
            layout={tabs_as_page_configs}
            tabIndex={tabIndex}
            onSelect={handleTabChange}
          />
        </div>
      )}

      <Switch>
        {tabs_as_page_configs.map((v, i) => {
          return (
            <Route
              key={v.id}
              path={v.path}
              render={() => <Screen screen={v.id} />}
            />
          );
        })}
      </Switch>
    </div>
  );
}

function TabNavigationApp(props?: { savedLayout: NavigationStoreState }) {
  const [workmode, setWorkmode] = useState<WorkMode>(WorkMode.code);
  const [workmodeSet, setWorkmodeSet] = useState<PrimaryWorkmodeSet>(
    props?.savedLayout?.workmodeSet
  );

  const on_workmode_select = (workmode: WorkMode) => {
    setWorkmode(workmode);
  };

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [expansion, setExpansion] = useState<boolean>(true);

  return (
    <>
      <Wrapper>
        <Column
          style={{
            width: "100%",
            justifyItems: "center",
            // marginBottom: "-8px",
          }}
        >
          <Row>
            <PrimaryWorkmodeSelect
              selection={workmode}
              set={workmodeSet}
              onSelect={on_workmode_select}
            />
            <NavigatorExpansionControlButton
              action={expansion ? "close" : "expand"}
              onClick={() => setExpansion(!expansion)}
            />
          </Row>
          {!expansion && <DropNav />}
        </Column>
      </Wrapper>

      {/* {expansion && ( */}
      <TabsLayout
        workmode={workmode}
        tabIndex={tabIndex}
        isTabVisible={expansion}
        onChange={(index, screen) => {
          _update_focused_screen_ev(screen);
          setTabIndex(index);
        }}
      />
      {/* )} */}
    </>
  );
  //
}

function RouterTabNavigationApp(props) {
  const [savedLayout, setSavedLayout] = useState<NavigationStoreState>();
  useEffect(() => {
    loadLayout().then((l) => setSavedLayout(l));
  }, []);

  const params = props.match.params;
  const workmode = params.workmode;
  const work = params.work;
  // TODO: make new layout based on saved one and givven param.

  return <>{savedLayout && <TabNavigationApp savedLayout={savedLayout} />}</>;
}

function Home() {
  const [savedLayout, setSavedLayout] =
    useState<NavigationStoreState>(undefined);

  useEffect(() => {
    loadLayout()
      .then((d) => {
        setSavedLayout(d);
      })
      .finally(() => {});
  }, []);

  return <>{savedLayout && <TabNavigationApp savedLayout={savedLayout} />}</>;
}

export default function App(props: { platform: TargetPlatform }) {
  useEffect(() => {
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

  const Router = getDedicatedRouter();
  return (
    <PluginApp platform={props.platform}>
      {/* @ts-ignore */}
      <Router>
        <Switch>
          {/* # region unique route section */}
          {standalone_pages.map((p) => {
            return (
              <Route
                key={p.id}
                path={p.path}
                render={() => {
                  return <Screen screen={p.id} />;
                }}
              />
            );
          })}
          {/* # endregion unique route section */}
          {/* dynamic route shall be placed at the last point, since it overwrites other routes */}
          <Route path="/:workmode/:work" component={RouterTabNavigationApp} />
          <Route path="/" component={Home} />
          {/* 👆 this is for preventing blank page on book up. this will be fixed and removed.*/}
        </Switch>
      </Router>
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
  padding: 0 8px;
  /* margin-bottom: -8px; */
`;
