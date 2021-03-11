import { Button } from "@material-ui/core";
import * as React from "react";
import io from "socket.io-client";
import { createAuthenticationUrl } from "@bridged.xyz/client-sdk";

interface State {}

function createRequestSessionId() {
  return Math.random().toString(36).slice(2);
}

let socket;
export class AuthScreen extends React.Component<any, State> {
  constructor(props) {
    super(props);

    this.state = {
      request_session_id: "",
      token: ""
    };
  }

  componentDidMount() {
    socket = io("http://localhost:3000");

    socket.on("send-response", token => {
        window.localStorage.setItem("token", token)
    })
  }

  onClick = () => {
    const sessionId = createRequestSessionId();
    socket.emit("assitant-save-request-session-id", sessionId);
    window.open(createAuthenticationUrl({
        redirect_uri: "figma://",
        request_session_id: sessionId
    }));
    this.setState({
      request_session_id: sessionId,
    });
  };

  render() {
    return (
      <div>
        <Button
          className="btn-quick-look"
          style={{ marginTop: 20 }}
          onClick={this.onClick}
        >
          SIGN IN / UP
        </Button>
      </div>
    );
  }
}
