import * as React from 'react';
import { default as PrismHighlight, defaultProps, Language } from "prism-react-renderer";
import copy from 'copy-to-clipboard';
import "./highlight.css"

// region custom dart support
// https://github.com/FormidableLabs/prism-react-renderer/issues/22#issuecomment-553042928
import Prism from 'prism-react-renderer/prism';
import dartLang from 'refractor/lang/dart';
import { EK_COPIED } from '../constants/ek.constant';
import { quickLook } from '../../dev-tools/quicklook';
import { Widget } from '@bridged.xyz/flutter-builder';
dartLang(Prism);
// endregion

interface State {
    isLaunchingConsole: boolean
}

interface Props {
    language: Language | any;
    widget: Widget
    code: string
};

export default class Highlight extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            isLaunchingConsole: false
        }
    }

    onCopyClicked = (e) => {
        copy(this.props.code);
        parent.postMessage({ pluginMessage: { type: EK_COPIED } }, '*')
    }

    onQuickLookClicked = (e) => {
        this.setState((p, s) => {
            return {
                isLaunchingConsole: true
            }
        })
        quickLook('quicklook', this.props.code).then((r) => {
            this.setState((p, s) => {
                return {
                    isLaunchingConsole: false
                }
            })
        }).catch((e) => {
            this.setState((p, s) => {
                return {
                    isLaunchingConsole: false
                }
            })
        })

    }

    render() {
        return <code>
            <div>
                <button className="copy" onClick={this.onCopyClicked}>copy code</button>
                <button className="quick look" disabled={this.state.isLaunchingConsole} onClick={this.onQuickLookClicked}>{this.state.isLaunchingConsole ? 'launching..' : 'quick look'}</button>
            </div>
            <PrismHighlight {...defaultProps} Prism={Prism} code={this.props.code} language={this.props.language}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={className} style={style}>
                        {tokens.map((line, i) => (
                            <div {...getLineProps({ line, key: i })}>
                                {line.map((token, key) => (
                                    <span {...getTokenProps({ token, key })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </PrismHighlight>
        </code>
    }
}
