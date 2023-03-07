import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { Bubble, GroupLabel } from "./components";
import { PromptInputBox } from "@ui/ai";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import ReactMarkdown from "react-markdown";
import type { Message } from "./core/conversation";
import * as api from "./client";
import {
  remarkColorPlugin,
  remarkGradientPlugin,
  remarkQuotationPlugin,
} from "./plugins";

export function ChatScreen() {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const messages_bottom_ref = React.useRef<HTMLDivElement>(null);

  const action = () => {
    setBusy(true);
    setMessage("");

    const history = Array.from(messages);

    // add user's message
    setMessages((l) =>
      l.concat({
        role: "user",
        content: message,
      })
    );

    api
      .chat({ content: message, history: history })
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
                    <MarkdownView
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
                          <ActionableListItem {...props} />
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
  let __type: "img" | "div" = "img";
  let __src = src;
  let __background = "transparent";
  // transform src
  try {
    const _ = new URL(alt);

    switch (_.protocol) {
      case "color:":
        __type = "div";
        __src = "//:0";
        __background = alt.replace("color://", "");

        break;
    }
  } catch (e) {}

  switch (__type) {
    case "div":
      return (
        <div
          id="custom-graphic"
          {...props}
          style={{
            margin: 4,
            background: __background,
            width: 64,
            height: 64,
            borderRadius: 8,
          }}
        />
      );
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

const MarkdownView = styled(ReactMarkdown)`
  ul {
    padding-inline-start: 0px;
  }
`;

const ActionableListItem = styled.li`
  list-style: none;
  margin: 8px;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 4px 1px rgba(0, 0, 0, 0.1);
  }
`;
