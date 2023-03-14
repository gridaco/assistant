import React, { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { Bubble, GroupLabel } from "../components";
import { PromptInputBox } from "@ui/ai";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import ReactMarkdown from "react-markdown";
import type { Message } from "core";
import { useHistory } from "react-router-dom";
import * as api from "../client";
import {
  remarkColorPlugin,
  remarkGradientPlugin,
  remarkQuotationPlugin,
} from "../plugins";
import { ColorChip, ResponseActionableListItem } from "../blocks";

export function ChatScreen() {
  const history = useHistory();
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const messages_bottom_ref = React.useRef<HTMLDivElement>(null);

  const action = () => {
    // handle commands
    if (message.startsWith("/")) {
      const [command, ...args] = message.split(" ");
      switch (command) {
        case "/code": {
          history.push("/code");
          break;
        }
        case "/preview": {
          history.push("/design/preview");
          break;
        }
        case "/clear":
          break;
        case "/help":
          break;
      }
    }

    setBusy(true);
    setMessage("");

    const recent_messages = Array.from(messages).splice(-10);

    // add user's message
    setMessages((l) =>
      l.concat({
        role: "user",
        content: message,
      })
    );

    api
      .chat({ content: message, history: recent_messages })
      .then(({ response, meta }) => {
        // console.log("re:", response);
        setMessages((l) =>
          l.concat({
            role: "assistant",
            content: response,
          })
        );
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setBusy(false);
      });
  };

  const scrollToBottom = () => {
    messages_bottom_ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: 1,
      }}
    >
      {messages?.length ? (
        <>
          <Messages ref={messages_bottom_ref} data={messages} />
        </>
      ) : (
        <></>
      )}

      <motion.div
        style={{
          padding: 16,
        }}
        initial={{
          opacity: 0.0,
          y: 16,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.2,
          damping: 15,
          stiffness: 200,
        }}
      >
        <PromptInputBox
          //
          canSubmit={message.length > 1}
          readonly={busy}
          prompting={busy}
          onSubmit={action}
          value={message}
          submit={{
            icon: <PaperPlaneIcon />,
          }}
          onChange={(v) => {
            setMessage(v);
          }}
          style={{
            background: "white",
          }}
          onPreviousPrompt={() => {
            // load the previous prompt
            setMessage(
              messages
                .filter((m) => m.role === "user")
                .map((m) => m.content)
                .pop() || ""
            );
          }}
          onNextPrompt={() => {
            // load the next prompt
            setMessage(
              messages
                .filter((m) => m.role === "user")
                .map((m) => m.content)
                .shift() || ""
            );
          }}
        />
      </motion.div>
    </div>
  );
}

const ResponseItem = ({
  children,
  delay,
}: React.PropsWithChildren<{
  delay: number;
}>) => {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: {
          delay,
          damping: 15,
          stiffness: 200,
        },
      }}
      exit={{ y: -16, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

const Messages = React.forwardRef(function Messages(
  { data }: { data: Message[] },
  bottomRef?: React.Ref<HTMLDivElement>
) {
  return (
    <>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          gap: 8,
        }}
      >
        {/* @ts-ignore */}
        <AnimatePresence>
          {data.map(({ content, role }, index) => {
            const emoji = role === "user" ? "👨‍💻" : "🤖";

            return (
              <ResponseItem delay={0.2} key={index}>
                <Bubble
                  style={{
                    background: role === "user" ? "white" : undefined,
                    flexDirection: "row",
                    gap: 12,
                    borderRadius: 0,
                  }}
                  onClick={() => {
                    // TODO:
                  }}
                >
                  <div
                    style={{
                      fontSize: 21,
                    }}
                  >
                    {emoji}
                  </div>
                  <p>
                    <MarkdownView>
                      <ReactMarkdown
                        remarkPlugins={[
                          remarkQuotationPlugin,
                          remarkGradientPlugin,
                          remarkColorPlugin,
                        ]}
                        disallowedElements={[]}
                        components={{
                          data: ({ node, ...props }) => {
                            alert(JSON.stringify(node));
                            return <strong {...props}></strong>;
                          },
                          img: ({ node, ...props }) => (
                            <CustomGraphic {...props} />
                          ),
                          h1: ({ node, ...props }) => (
                            // p
                            <strong>
                              <p {...props} />
                            </strong>
                          ),
                          h2: ({ node, ...props }) => (
                            // p
                            <strong>
                              <p {...props} />
                            </strong>
                          ),
                          h3: ({ node, ...props }) => (
                            // p
                            <p {...props} />
                          ),
                          h4: ({ node, ...props }) => (
                            // p
                            <p {...props} />
                          ),
                          h5: ({ node, ...props }) => (
                            // p
                            <p {...props} />
                          ),
                          h6: ({ node, ...props }) => (
                            // p
                            <p {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <ResponseActionableListItem {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              style={{
                                margin: 0,
                              }}
                              {...props}
                            />
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              style={{
                                background: "rgba(0,0,0,0.1)",
                                padding: 4,
                                borderRadius: 4,
                                fontFamily: "monospace",
                                fontSize: 14,
                                display: "inline-block",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                hyphens: "auto",
                                lineHeight: 1.5,
                                overflowX: "auto",
                                boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                                color: "rgba(0,0,0,0.8)",
                                border: "none",
                                outline: "none",
                                resize: "none",
                                verticalAlign: "top",
                              }}
                              {...props}
                            />
                          ),
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </MarkdownView>
                  </p>
                </Bubble>
              </ResponseItem>
            );
          })}
        </AnimatePresence>
        <div style={{ float: "left", clear: "both" }} ref={bottomRef} />
      </div>
    </>
  );
});

function CustomGraphic({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  let __type: "img" | "color-chip" = "img";
  let __src = src;
  let __background = "transparent";
  // transform src
  try {
    const _ = new URL(alt);

    switch (_.protocol) {
      case "color:":
        __type = "color-chip";
        __src = "//:0";
        __background = alt.replace("color://", "");

        break;
    }
  } catch (e) {}

  switch (__type) {
    case "color-chip":
      return <ColorChip {...props} color={__background} />;
    case "img": {
      return (
        <img
          id="custom-graphic"
          {...props}
          src={__src}
          style={{
            margin: 4,
            width: 160,
            height: 160,
            objectFit: "cover",
          }}
        />
      );
    }
  }
}

const MarkdownView = styled.div`
  ul,
  ol {
    padding-inline-start: 0px;
  }
`;
