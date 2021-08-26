import React, { useState, useEffect } from "react";
import "../app.css"; /** TODO: remove raw css usage. */
import { initialize as analytics_initialize } from "@assistant-fp/analytics";

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
  NavigationStoreState,
  loadLayout,
  saveLayout,
  updateLayout,
  get_page_config_by_path,
} from "../navigation";

import {
  WorkmodeScreenTabs,
  PrimaryWorkmodeSelect,
  NavigatorExpansionControlButton,
  SecondaryMenuDropdown,
} from "../components/navigation";
import styled from "@emotion/styled";
import { Column, Row } from "../components/style/global-style";
import { UploadSteps } from "../components/upload-steps";

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

  useEffect(() => {
    handleTabChange(tabIndex);
  }, []);

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

function TabNavigationApp(props: { savedLayout: NavigationStoreState }) {
  const [workmode, setWorkmode] = useState<WorkMode>(
    props.savedLayout.currentWorkmode
  );
  const [workmodeSet, setWorkmodeSet] = useState<PrimaryWorkmodeSet>(
    props.savedLayout.workmodeSet
  );
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [expansion, setExpansion] = useState<boolean>(true);

  const on_workmode_select = (workmode: WorkMode) => {
    setWorkmode(workmode);
    setTabIndex(0);
    setExpansion(true);
  };

  const on_work_select = (index, screen) => {
    _update_focused_screen_ev(screen);
    setTabIndex(index);
    updateLayout({
      workmode: workmode,
      work: screen,
    });
  };

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
          {!expansion && <SecondaryMenuDropdown />}
        </Column>
      </Wrapper>

      {/* {expansion && ( */}
      <TabsLayout
        key={workmode}
        workmode={workmode}
        tabIndex={tabIndex}
        isTabVisible={expansion}
        onChange={on_work_select}
      />
      {/* )} */}
    </>
  );
  //
}

function RouterTabNavigationApp(props) {
  const [savedLayout, setSavedLayout] = useState<NavigationStoreState>();
  const workmode = props.match.params.workmode;
  const work = props.match.params.work;
  const path = "/" + workmode + "/" + work;
  useEffect(() => {
    const _page_config = get_page_config_by_path(path);

    loadLayout().then((l) =>
      setSavedLayout({
        ...l,
        currentWorkmode: workmode,
        currentWork: _page_config.id,
      })
    );
  }, []);

  return <>{savedLayout && <TabNavigationApp savedLayout={savedLayout} />}</>;
}

function Home() {
  const history = useHistory();
  const [savedLayout, setSavedLayout] =
    useState<NavigationStoreState>(undefined);

  useEffect(() => {
    loadLayout()
      .then((d) => {
        setSavedLayout(d);
      })
      .finally(() => {});
  }, []);

  if (savedLayout) {
    const p = get_page_config(savedLayout.currentWork).path;
    history.replace(p);
  }

  return <></>;
}

export default function App(props: { platform: TargetPlatform }) {
  useEffect(() => {
    // FIXME: - dynamicallt change initial focused screen. (currently inital setup is not implemented. - initial setup is done by below line.)
    _update_focused_screen_ev(WorkScreen.code_flutter);

    // region init analytics
    try {
      analytics_initialize();
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
}

const Wrapper = styled.div`
  display: flex;
  padding: 0 8px;
  /* margin-bottom: -8px; */
`;
