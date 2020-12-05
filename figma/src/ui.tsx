import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { DevTools } from './app/components/dev-tools';
import firebase from './firebase/firebase-init';
import './ui.css'
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { CodeScreen } from './app/screens/code-screen';
import { LintScreen } from './app/screens/lint-screen';
import { IconsScreen } from './app/screens/icons-screen';
import { EK_SET_APP_MODE } from './app/constants/ek.constant';
import { GlobalizationScreen } from './app/screens/g11n-screen';

interface TabPanelProps {
  children?: React.ReactNode;
  type: AppMode;
  value: AppMode;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, type, ...other } = props;


  return (
    <div
      role="tabpanel"
      hidden={value !== type}
      id={`app-tab-${type}`}
      // aria-labelledby={`tab-${type}`}
      {...other}
    >
      {value === type && (
        <>{props.children}</>
      )}
    </div>
  );
}

function a11yProps(mode: AppMode) {
  return {
    id: `app-tab-${mode}`,
    // 'aria-controls': `tab-${mode}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
  },
}));


export enum AppMode {
  code = 0,
  icon = 1,
  lint = 2,
  g11n = 3,
  dev = 4,
  slot = 5,
}

function appModeToName(appMode: AppMode): string {
  switch (appMode) {
    case AppMode.code:
      return "code"
    case AppMode.dev:
      return "tools"
    case AppMode.icon:
      return "icon"
    case AppMode.lint:
      return "lint"
    case AppMode.slot:
      return "slots"
    case AppMode.g11n:
      return "globalization"
  }
}

export default function App() {
  const classes = useStyles();
  const [mode, setMode] = React.useState<AppMode>(AppMode.code);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: AppMode) => {
    // notify code.ts that app mode has set.
    parent.postMessage({
      pluginMessage: {
        type: EK_SET_APP_MODE,
        data: newValue
      }
    }, "*")
    setMode(newValue);
  };

  // region init firebase
  try {
    firebase.analytics()
  } catch (e) {
    console.warn("firebase is disabled. it seems you are contributing to this project!, no worries, other functionalyties will work fine.")
  }
  // endregion init firebase

  if (process.env.NODE_ENV == "production") {
    return <div>
      <Tabs value={mode} onChange={handleChange} aria-label="primary tab">
        <Tab label={appModeToName(AppMode.code)} {...a11yProps(AppMode.code)} />
        <Tab label={appModeToName(AppMode.icon)} {...a11yProps(AppMode.icon)} />
      </Tabs>
      <TabPanel value={mode} type={AppMode.code}>
        <CodeScreen />
      </TabPanel>
      <TabPanel value={mode} type={AppMode.icon}>
        <IconsScreen />
      </TabPanel>
    </div>
  } else {
    return (
      <div>
        <Tabs value={mode} onChange={handleChange} aria-label="primary tab">
          <Tab label={appModeToName(AppMode.code)} {...a11yProps(AppMode.code)} />
          <Tab label={appModeToName(AppMode.icon)} {...a11yProps(AppMode.icon)} />
          <Tab label={appModeToName(AppMode.lint)} {...a11yProps(AppMode.lint)} />
          {/* <Tab label={appModeToName(AppMode.dev)} {...a11yProps(AppMode.dev)} /> */}
          <Tab label={appModeToName(AppMode.g11n)} {...a11yProps(AppMode.g11n)} />
        </Tabs>
        <TabPanel value={mode} type={AppMode.code}>
          <CodeScreen />
        </TabPanel>
        <TabPanel value={mode} type={AppMode.icon}>
          <IconsScreen />
        </TabPanel>
        <TabPanel value={mode} type={AppMode.lint}>
          <LintScreen />
        </TabPanel>
        {/* <TabPanel value={mode} type={AppMode.dev}>
          <DevTools />
        </TabPanel> */}
        <TabPanel value={mode} type={AppMode.g11n}>
          <GlobalizationScreen />
        </TabPanel>
      </div>
    )
  }
}



ReactDOM.render(<App />, document.getElementById('react-page'))