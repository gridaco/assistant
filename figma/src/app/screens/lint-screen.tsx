import { ReflectLintFeedback } from "@reflect.bridged.xyz/linter/lib/feedbacks";
import * as React from "react";
import { Preview } from "../components/preview";
import { EK_LINT_FEEDBACK } from "../constants/ek.constant";

interface State {
    feedbacks: Array<ReflectLintFeedback>
}

export class LintScreen extends React.Component<any, State> {
    constructor(props) {
        super(props)

        this.state = {
            feedbacks: []
        }
    }

    componentDidMount() {
        window.onmessage = (ev: MessageEvent) => {
            console.log(ev)
            const msg = ev.data.pluginMessage;
            if (msg.type == EK_LINT_FEEDBACK) {
                const feedbacks = msg.data as Array<ReflectLintFeedback>
                this.setState((state, props) => {
                    return { feedbacks: feedbacks }
                });
            }
        }
    }

    render() {
        const { feedbacks } = this.state
        return <>
            <Preview data={undefined} name="selected node name" />
            <div>
                {feedbacks.map(function (item) {
                    return <div>
                        <li>{item.name}</li>
                        <li>{item.message}</li>
                    </div>;
                })}

            </div>
        </>
    }
}