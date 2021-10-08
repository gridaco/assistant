import React, { useState, useEffect } from "react";
import "../app.css"; /** TODO: remove raw css usage. */
import { initialize as analytics_initialize } from "@assistant-fp/analytics";

// UI COMPS
import { EK_SET_APP_MODE } from "@core/constant/ek.constant";
import { PluginApp } from "plugin-app";
import { useHistory, Switch, Route } from "react-router-dom";
import type { TargetPlatform } from "@plugin-sdk/core";

//
// region screens import
import { ButtonMakerScreen } from "@app/button-maker";
import { LayoutViewScreen } from "../pages/layout-view";
import { ComponentViewScreen } from "@app/component-manage";
import { LintScreen } from "@app/design-lint";
import { IconsScreen } from "@app/icons-loader";
import { MetaEditorScreen, BatchMetaEditor } from "@app/meta-editor";
import { ExporterScreen } from "@app/export-scene-as-json";
import { DataMapperScreen } from "@app/data-mapper";
import { GlobalizationScreen } from "@app/i18n";
import { ToolboxScreen } from "../pages/tool-box";
import { FontReplacerScreen } from "@toolbox/font-replacer";
import { CodeScreen } from "@app/design-to-code";
import { AboutScreen } from "../pages/about";
import { SigninScreen } from "@app/auth";
import { DesignTextCdoeSyntaxHighligherScreen } from "@app/design-text-code-syntax-highlight";
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
import { Column, Row } from "@ui/core";
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
    case WorkScreen.tool_code_syntax_highlighter:
      return <DesignTextCdoeSyntaxHighligherScreen />;
    case WorkScreen.scene_upload_steps_final:
      return <UploadSteps />;
    case WorkScreen.signin:
      return <SigninScreen />;
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
        <div className="tabs-wrapper">
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
          <Row style={{ paddingTop: "22px" }}>
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
  const [savedLayout, setSavedLayout] = useState<NavigationStoreState>(
    undefined
  );

  useEffect(() => {
    loadLayout()
      .then((d) => {
        setSavedLayout(d);
      })
      .catch((e) => {
        console.log("failed loading layout", e);
      })
      .finally(() => {});
  }, []);

  if (savedLayout) {
    try {
      const p = get_page_config(savedLayout.currentWork).path;
      history.replace(p);
    } catch (e) {
      console.log("failed to load saved layout", e);
      console.log(
        "this can happen during development, switching between branches, or could happen on production wehn new version lo longer has a page that is previously loaded."
      );
      // if somehow, failed loading the path of the current work, we will redirect to the home page.
      // this can happen during development, switching between branches, or could happen on production wehn new version lo longer has a page that is previously loaded.
      history.replace("/code/preview");
    }
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
  padding: 0 16px;
  /* padding: 0 8px; */
`;
