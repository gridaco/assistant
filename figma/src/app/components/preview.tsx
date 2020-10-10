import * as React from "react";
import "./preview.css"

interface Props {
    data: Uint8Array,
    name: string
}

interface State {
    url: string
}

export class Preview extends React.Component<Props, State>{
    constructor(props) {
        super(props);
        this.state = {
            url: null
        }
    }

    componentDidMount() {

    }

    get url(): string {
        if (this.props.data) {
            var blob = new Blob([this.props.data], { 'type': 'image/png' });
            var url = URL.createObjectURL(blob);
            return url;
        }
    }

    render() {
        let render = this.url ?
            <img className="render" alt={this.props.name} src={this.url} width="100%" height="200px"></img> :
            <div className="render">
                <br /><br /><h4>select anything</h4><br /><br />
            </div>

        return <div className="preview">
            {render}
        </div>
    }
}