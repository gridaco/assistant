import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BoxTab } from './app/components/box-tab';
import { DevTools } from './app/components/dev-tools';
import Highlight from './app/components/highlight';
import { Preview } from './app/components/preview';
import firebase from './firebase/firebase-init';
import './ui.css'
import { format } from './utils/dart-format';


class App extends React.Component {

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

  onClickRandomize(e) {
    parent.postMessage({ pluginMessage: { type: 'randomize-selection' } }, '*')
  }


  onClickOpenConsole(e) {
    open("https://bridged.xyz/");
  }

  onClickReportIssue(e) {
    open("https://github.com/bridgedxyz/assistant/issues/new/choose");
  }

  render() {
    return <div>
      <Preview data={(this.state as any).previewImage} name={(this.state as any).name}></Preview>
      <Highlight language="dart" code={(this.state as any).code}></Highlight>
      {/* commenting out for plugin release */}
      {/* <button onClick={this.onClickRandomize}>
        randomize
      </button>
      <button onClick={this.onClickOpenConsole}>
        open in console
      </button>
      <BoxTab /> */}
      <button onClick={this.onClickReportIssue}>
        report issue
      </button>
      <button onClick={this.onClickOpenConsole}>
        visit website
      </button>
      <div>
        <DevTools></DevTools>
      </div>
    </div>
  }
}


ReactDOM.render(<App />, document.getElementById('react-page'))