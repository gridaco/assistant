import React, { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

// TODO: add auto sizing - https://github.com/microsoft/monaco-editor/issues/794#issuecomment-688959283
export function MonacoEditor({
  src,
  language,
  minHeight = 800,
}: {
  /**
   * minheight is also a initial height.
   */
  minHeight?: number;
  src: string;
  language: string;
}) {
  const monaco = useMonaco();
  const [height, setHeight] = React.useState(minHeight);

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
  }, [src]);

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
        onMount={(editor) => {
          editor.onDidContentSizeChange(() => {
            updateHeight(editor);
          });
        }}
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
