import React, { useEffect } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

// TODO: add auto sizing - https://github.com/microsoft/monaco-editor/issues/794#issuecomment-688959283
export function MonacoEditor(props: { src: string; language: string }) {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: "React",
        allowJs: true,
        typeRoots: ["node_modules/@types"],
      });

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
    }
  }, [props.src]);
  const width = 500;
  const updateHeight = (editor) => {
    const container = document.getElementById("editor-wrap");
    let ignoreEvent = false;
    const contentHeight = Math.min(1000, editor.getContentHeight());
    container.style.width = `100%`;
    container.style.height = `${contentHeight}px`;
    console.log(contentHeight);
    try {
      ignoreEvent = true;
      editor.layout({ width, height: contentHeight });
    } finally {
      ignoreEvent = false;
    }
  };

  return (
    <>
      {/* <div id="editor-wrap"> */}
      <Editor
        loading={<></>} // TODO: add loading state.
        theme="vs-dark"
        height="1000px"
        defaultLanguage={monacolanguage(props.language)}
        defaultValue={extended_value(props.src)}
        value={extended_value(props.src)}
        // onMount={updateHeight}
        options={{
          fontFamily: `Menlo, Monaco, 'Courier New', monospace`,
          fontSize: 14,
          colorDecorators: true,
          minimap: {
            // disable minimap a.k.a preview
            enabled: false,
          },
          renderIndentGuides: true, // need color customization
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
          readOnly: true,
          renderFinalNewline: true,
          //
          // wordWrap: "on",
          // wrappingStrategy: "advanced",
          // overviewRulerLanes: 0,
        }}
      />
      {/* </div> */}
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

function extended_value(value: string) {
  return value + "\n".repeat(10);
}
