import * as React from "react";
import { Preview } from "../components/preview";


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
        return <>
            <Preview data={undefined} name="selected node name" />
        </>
    }
}