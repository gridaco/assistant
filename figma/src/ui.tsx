import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { DevTools } from './app/components/dev-tools';
import Highlight from './app/components/highlight';
import { Preview } from './app/components/preview';
import firebase from './firebase/firebase-init';
import './ui.css'
import { format } from './utils/dart-format';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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

  return (
    <div>
      <Tabs value={value} onChange={handleChange} aria-label="primary tab">
        <Tab label="code" {...a11yProps(0)} />
        <Tab label="design" {...a11yProps(1)} />
        <Tab label="devtool" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <CodeTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DevTools />
      </TabPanel>
    </div>
  );
}



class CodeTab extends React.Component {

  constructor(props) {
    super(props);

    this.state = { code: "//\n//\n//\n// there is no selected node\n//\n//\n//", previewImage: null };
    try {
      firebase.analytics()
    } catch (e) {
      console.warn("firebase is disabled. it seems you are contributing to this project!, no worries, other functionalyties will work fine.")
    }
  }

  componentDidMount() {

    // subscribe code
    window.onmessage = (ev: MessageEvent) => {


      const msg = ev.data.pluginMessage;

      switch (msg.type) {
        case "result":
          const code = format(msg.data);
          this.setState((state, props) => {
            return { code: code };
          });
          break;
        case "preview":
          this.setState((state, props) => {
            return { previewImage: msg.data.source, name: msg.data.name };
          });
          break;
      }
    }
  }


  onClickReportIssue(e) {
    open("https://github.com/bridgedxyz/assistant/issues/new/choose");
  }

  onClickVisitWebsite(e) {
    open("https://bridged.xyz/");
  }

  render() {
    return <div>
      <Preview data={(this.state as any).previewImage} name={(this.state as any).name}></Preview>
      <Highlight language="dart" code={(this.state as any).code}></Highlight>
      <button onClick={this.onClickReportIssue}>
        report issue
      </button>
      <button onClick={this.onClickVisitWebsite}>
        visit website
      </button>
    </div>
  }
}


ReactDOM.render(<App />, document.getElementById('react-page'))