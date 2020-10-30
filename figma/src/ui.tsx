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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;


  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>{props.children}</>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
  },
}));

export default function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  // init firebase
  try {
    firebase.analytics()
  } catch (e) {
    console.warn("firebase is disabled. it seems you are contributing to this project!, no worries, other functionalyties will work fine.")
  }

  if (process.env.NODE_ENV == "production") {
    return <CodeScreen />
  } else {
    return (
      <div>
        <Tabs value={value} onChange={handleChange} aria-label="primary tab">
          <Tab label="code" {...a11yProps(0)} />
          <Tab label="lint" {...a11yProps(1)} />
          <Tab label="slots" {...a11yProps(2)} />
          <Tab label="devtool" {...a11yProps(3)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <CodeScreen />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <LintScreen />
        </TabPanel>
        <TabPanel value={value} index={2}>
          slots
      </TabPanel>
        <TabPanel value={value} index={3}>
          <DevTools />
        </TabPanel>
      </div>
    )
  }
}



ReactDOM.render(<App />, document.getElementById('react-page'))