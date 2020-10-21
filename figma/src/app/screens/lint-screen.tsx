import { Typography } from "@material-ui/core";
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
        window.addEventListener("message", (ev: MessageEvent) => {
            const msg = ev.data.pluginMessage;
            console.log(msg)
            if (msg.type == EK_LINT_FEEDBACK) {
                const feedbacks = msg.data as Array<ReflectLintFeedback>
                this.setState((state, props) => {
                    return { feedbacks: feedbacks }
                });
            }
        });
    }

    onFeedbackTap = (e) => {
        // move to target element
    }


    render() {
        const { feedbacks } = this.state
        return <>
            <Preview data={undefined} name="selected node name" />
            <ul>
                {feedbacks.map(function (item) {
                    return <li key={item.name}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="body2">{item.userMessage}</Typography>
                    </li>
                })}

            </ul>
        </>
    }
}