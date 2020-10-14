import * as React from "react";


export class LintScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        window.onmessage = (ev: MessageEvent) => {
            if (ev.type == "lint-result") {

            }
        }
    }

    render() {
        return <>lint</>
    }
}