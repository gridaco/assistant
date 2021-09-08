import React, { useEffect } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

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

  return (
    <>
      <Editor
        loading={<></>} // TODO: add loading state.
        theme="vs-dark"
        height="100%"
        defaultLanguage={props.language}
        defaultValue={props.src}
        value={props.src}
        options={{
          fontFamily: `Menlo, Monaco, 'Courier New', monospace`,
          fontSize: 14,

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
        }}
      />
    </>
  );
}
