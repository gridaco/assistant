import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { PromptInputBox, Bubble, GroupLabel } from "./components";
import { LightningBoltIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { EK_APPLY_TEXT_CHARACTERS } from "@core/constant";
import * as api from "./client";
import { useSingleSelection } from "plugin-app";
import { IReflectNodeReference } from "@design-sdk/figma-node";

interface ReplaceTextCharactersProps {
  type: "selection" | "id";
  id?: string;
  characters: string;
}

function __plugin_replace_text_characteres(d: ReplaceTextCharactersProps) {
  parent.postMessage(
    {
      pluginMessage: {
        type: EK_APPLY_TEXT_CHARACTERS,
        data: d,
      },
    },
    "*"
  );
}

function useSingleText() {
  // TODO: make it native, performance efficient.

  const [text, setText] = React.useState<string>();
  const selection = useSingleSelection();

  useEffect(() => {
    if (selection) {
      if (selection.node.type === "TEXT") {
        if ("characters" in selection.node) {
          // @ts-ignore
          setText(selection.node.characters as string);
        } else {
          alert("not supported");
        }
      }
    }
  }, [selection]);

  return text;
}

export function CopywriterScreen() {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [prompt, setPrompt] = React.useState("");
  const [results, setResults] = React.useState<string[]>([]);
  const [setbyuser, setSetbyuser] = React.useState(false);

  const selectiontext = useSingleText();

  useEffect(() => {
    // initially load text from selected one, only for the first time.
    if (selectiontext) {
      if (!setbyuser || !prompt.trim().length) {
        setPrompt(selectiontext);
        setSetbyuser(false);
      }
    }
  }, [selectiontext]);

  const action = () => {
    setBusy(true);

    // clear previous results
    setResults([]);

    api
      .prompt({ q: prompt })
      .then(({ texts }) => {
        setResults(texts);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setBusy(false);
      });
  };

  return (
    <div
      style={{
        margin: 16,
      }}
    >
      <motion.div
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
          canSubmit={prompt.length > 3}
          readonly={busy}
          prompting={busy}
          onSubmit={action}
          value={prompt}
          onChange={(v) => {
            setPrompt(v);
            setSetbyuser(true);
          }}
        />
      </motion.div>

      <motion.div
        style={{
          marginTop: 32,
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
          delay: 0.3,
          duration: 0.2,
          damping: 15,
          stiffness: 200,
        }}
      >
        {results?.length ? (
          <>
            <ResultsList data={results} />
          </>
        ) : (
          <>
            {/* disabling shortcuts */}
            {/* {!busy && <Shortcuts />} */}
          </>
        )}
      </motion.div>
    </div>
  );
}

const ResultItem = ({
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

function ResultsList({ data }: { data: string[] }) {
  return (
    <>
      <GroupLabel
        style={{
          marginBottom: 16,
        }}
      >
        <ListBulletIcon />
        Ideas
      </GroupLabel>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* @ts-ignore */}
        <AnimatePresence>
          {data.map((item, index) => (
            <ResultItem delay={index * 0.1} key={item}>
              <Bubble
                onClick={() => {
                  __plugin_replace_text_characteres({
                    type: "selection",
                    characters: item,
                  });
                }}
              >
                <p>{item}</p>
              </Bubble>
            </ResultItem>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

function Shortcuts() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <GroupLabel>
        <LightningBoltIcon />
        Shortcuts
      </GroupLabel>
      <Bubble>
        <p>
          Translate to{" "}
          <InlineSelect defaultValue="fr">
            <option value="fr">French</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="en">English</option>
          </InlineSelect>
        </p>
      </Bubble>
      <Bubble>
        <p>Give me Ideas</p>
      </Bubble>
      <Bubble>
        <p>
          Placeholder Text for
          <InlineSelect defaultValue="p">
            <option value="p">Paragraph</option>
            <option value="h1">Headline</option>
          </InlineSelect>
        </p>
      </Bubble>
    </div>
  );
}

const InlineSelect = styled.select`
  display: inline-block;
  margin-left: 4px;
  margin-right: 4px;
  outline: none;
  border: none;
  background: none;
`;
