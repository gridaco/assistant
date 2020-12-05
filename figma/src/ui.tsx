import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ToolboxScreen } from './app/screens/tool-box';
import firebase from './firebase/firebase-init';
import './ui.css'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { CodeScreen } from './app/screens/code-screen';
import { LintScreen } from './app/screens/lint-screen';
import { IconsScreen } from './app/screens/icons-screen';
import { EK_SET_APP_MODE } from './app/constants/ek.constant';
import { GlobalizationScreen } from './app/screens/g11n-screen';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { WorkScreen, WorkspaceMode } from './app/states/app-state';


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
      {value === index && (
        <>{props.children}</>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `app-tab-${index}`,
    // 'aria-controls': `tab-${mode}`,
  };
}

function workScreenToName(appMode: WorkScreen): string {
  switch (appMode) {
    case WorkScreen.code:
      return "code"
    case WorkScreen.dev:
      return "tools"
    case WorkScreen.icon:
      return "icon"
    case WorkScreen.lint:
      return "lint"
    case WorkScreen.slot:
      return "slots"
    case WorkScreen.g11n:
      return "globalization"
  }
}

function worspaceModeToName(workspaceMode: WorkspaceMode): string {
  switch (workspaceMode) {
    case WorkspaceMode.code:
      return "CODE"
    case WorkspaceMode.design:
      return "DESIGN"
    case WorkspaceMode.content:
      return "CONTENT"
    case WorkspaceMode.settings:
      return "SETTINGS"
  }
}


type TabLayout = ReadonlyArray<WorkScreen>

function getWorkspaceTabLayout(workspaceMode: WorkspaceMode): TabLayout {
  switch (workspaceMode) {
    case WorkspaceMode.code:
      return [
        WorkScreen.code,
        WorkScreen.lint,
        WorkScreen.slot,
      ]
    case WorkspaceMode.design:
      return [
        WorkScreen.icon,
        WorkScreen.lint,
      ]
    case WorkspaceMode.content:
      return [
        WorkScreen.g11n,
        WorkScreen.lint,
      ]
    case WorkspaceMode.settings:
      return []
  }
}


export default function App() {
  const [workspaceMode, setWorkspaceMode] = React.useState<WorkspaceMode>(WorkspaceMode.code)
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenWorkspaceModeChangeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleWorkspaceModeSelect = (e) => {
    const selected: WorkspaceMode = e.target.value
    console.log('newly selected workspace mode is:', selected)
    setAnchorEl(null);
    setWorkspaceMode(selected)

    // when workspace mode is updated, by default the first index 0 tab will be selected without select event. 
    // explicitly triggering the event.
    const newTabLayout = getWorkspaceTabLayout(selected)
    updateFocusedScreen(newTabLayout[0])
  };

  const updateFocusedScreen = (screen: WorkScreen) => {
    // notify code.ts that app mode has set.
    parent.postMessage({
      pluginMessage: {
        type: EK_SET_APP_MODE,
        data: screen
      }
    }, "*")
  }

  const handleTabChange = (event, index: number) => {
    const screen = tabLayout[index]
    updateFocusedScreen(screen)
    setTabIndex(index);
  };

  // region init firebase
  try {
    firebase.analytics()
  } catch (e) {
    console.warn("firebase is disabled. it seems you are contributing to this project!, no worries, other functionalyties will work fine.")
  }
  // endregion init firebase


  const tabLayout = getWorkspaceTabLayout(workspaceMode)
  function makeTabLayout(tabLayout: TabLayout) {

    const tabs = <>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="primary tab">
        {
          tabLayout.map((v, i) => {
            return <Tab key={v} label={workScreenToName(v)} {...a11yProps(i)} />
          })
        }
      </Tabs>
    </>

    const panels = <>
      {
        tabLayout.map((v, i) => {
          switch (v) {
            case WorkScreen.code:
              return <TabPanel key={i} value={tabIndex} index={i}><CodeScreen /></TabPanel>
            case WorkScreen.icon:
              return <TabPanel key={i} value={tabIndex} index={i}><IconsScreen /></TabPanel>
            case WorkScreen.lint:
              return <TabPanel key={i} value={tabIndex} index={i}><LintScreen /></TabPanel >
            case WorkScreen.dev:
              return <TabPanel key={i} value={tabIndex} index={i}><ToolboxScreen /></TabPanel >
            case WorkScreen.g11n:
              return <TabPanel key={i} value={tabIndex} index={i}><GlobalizationScreen /></TabPanel >
          }
        })
      }
    </>

    return <div>
      {tabs}
      {panels}
    </div>
  }


  const screenLayout = makeTabLayout(tabLayout)

  return (
    <div>
      <div>
        <Button endIcon={<KeyboardArrowDown />} aria-controls="workspace-mode" aria-haspopup="true" onClick={handleOpenWorkspaceModeChangeClick}>{worspaceModeToName(workspaceMode)}</Button>
        <Menu
          id="workspace-mode"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleWorkspaceModeSelect}
        >
          <MenuItem onClick={handleWorkspaceModeSelect} value={WorkspaceMode.code}>CODE</MenuItem>
          <MenuItem onClick={handleWorkspaceModeSelect} value={WorkspaceMode.design}>DESIGN</MenuItem>
          <MenuItem onClick={handleWorkspaceModeSelect} value={WorkspaceMode.content}>CONTENT</MenuItem>
        </Menu>
      </div>
      {screenLayout}
    </div>
  )
}



ReactDOM.render(<App />, document.getElementById('react-page'))