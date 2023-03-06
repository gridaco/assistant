import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { Bubble, GroupLabel } from "./components";
import { PromptInputBox } from "@ui/ai";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import ReactMarkdown from "react-markdown";
import type { Message } from "./core/conversation";
import * as api from "./client";

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
      .then(({ response }) => {
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
                    <ReactMarkdown>{content}</ReactMarkdown>
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
