import * as React from "react"


interface Props {
    onTap: Function
    name: string
    icon?: any
}

interface State {

}

export class LintItemRow extends React.Component<Props, State> {
    constructor(props) {
        super(props)
    }

    render() {
        return <>
            <p>{this.props.name}</p>
        </>
    }
}
