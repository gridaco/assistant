import React, { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { editor } from "monaco-editor";
import { register } from "./monaco-utils";

type ICodeEditor = monaco.editor.IStandaloneCodeEditor;

// TODO: add auto sizing - https://github.com/microsoft/monaco-editor/issues/794#issuecomment-688959283
export function MonacoEditor({
  src,
  language,
  minHeight = 800,
  onChange,
}: {
  /**
   * minheight is also a initial height.
   */
  minHeight?: number;
  src: string;
  language: string;
  onChange?: (code: string) => void;
}) {
  const [height, setHeight] = React.useState(minHeight);

  const instance = useRef<{ editor: ICodeEditor; format: any } | null>(null);
  const activeModel = useRef<any>();

  const onMount: OnMount = (editor, monaco) => {
    // REQUIRED
    editor.onDidContentSizeChange(() => {
      updateHeight(editor);
    });

    const format = editor.getAction("editor.action.formatDocument");
    const rename = editor.getAction("editor.action.rename");

    instance.current = { editor, format };

    activeModel.current = editor.getModel();

    register.initEditor(editor, monaco);

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
      format.run();
    });

    // disabled. todo: find a way to format on new line, but also with adding new line.
    // editor.addCommand(monaco.KeyCode.Enter, function () {
    //   format.run();
    // });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, function () {
      // don't reload the entire page, and..
      // Default is F2
      rename.run();
    });

    editor.onDidChangeModelContent((e) => {
      /* add here */
    });
  };

  const updateHeight = (editor: editor.IStandaloneCodeEditor) => {
    const contentHeight = Math.max(minHeight, editor.getContentHeight());
    setHeight(contentHeight);
  };

  return (
    <>
      <Editor
        loading={<></>} // TODO: add loading state.
        theme="vs-dark"
        height={height}
        beforeMount={register.initMonaco}
        onMount={onMount}
        onChange={onChange}
        defaultLanguage={monacolanguage(language)}
        defaultValue={src}
        value={src}
        // onMount={updateHeight}
        options={{
          fontFamily: `Menlo, Monaco, 'Courier New', monospace`,
          fontSize: 14,
          colorDecorators: true,
          minimap: {
            // disable minimap a.k.a preview
            enabled: false,
          },
          // renderIndentGuides: true, // need color customization
          scrollbar: {
            // allow parent scoll
            alwaysConsumeMouseWheel: false,
            vertical: "hidden",
            horizontal: "hidden",
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          folding: false,
          showFoldingControls: "mouseover",
          lineNumbers: "off", //marginAppliedLine,
          lineDecorationsWidth: "12px",
          glyphMargin: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          renderFinalNewline: true,
          //
          // wordWrap: "on",
          // wrappingStrategy: "advanced",
          // overviewRulerLanes: 0,
        }}
      />
    </>
  );
}

function monacolanguage(lang: string) {
  switch (lang) {
    case "js":
    case "jsx":
    case "tsx":
    case "ts":
    case "javascript":
    case "typescript":
      return "typescript";
    case "dart":
      return "dart";
    case "html":
      return "html";
    default:
      return "typescript";
  }
}
