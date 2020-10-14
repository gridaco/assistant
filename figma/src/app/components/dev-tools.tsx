import * as React from "react";



export class DevTools extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    hideAllExceptText = (e) => {
        parent.postMessage({ pluginMessage: { type: 'hide-all-except', data: { except: "TEXT" } } }, '*')
    }

    hideAllOnlyText = (e) => {
        parent.postMessage({ pluginMessage: { type: 'hide-all-only', data: { only: "TEXT" } } }, '*')
    }

    render() {
        return <div>
            <button onClick={this.hideAllExceptText}>hide all except text</button>
            <button onClick={this.hideAllOnlyText}>hide only text</button>
        </div>
    }
}