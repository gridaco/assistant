import React, { useState, useEffect } from "react";
import HighlightExecutor from "./components/highlight-executor";
import { SchemaAndLanguage } from "./models";
import { get_syntax_highlight_preferences } from "./preferences";
import "./design-text-code-syntax-highligh-screen.css";
import { RouteBackButton } from "app/lib/components/navigation/route-back-button";

export function DesignTextCdoeSyntaxHighligherScreen() {
  const [schemaAndLanguage, setSchemaAndLanguage] = useState<SchemaAndLanguage>(
    {
      language: "typescript",
      colorSchema: "vs2015",
    }
  );

  useEffect(() => {
    get_syntax_highlight_preferences().then((d) => {
      if (d) {
        setSchemaAndLanguage(d);
      }
    });
  }, []);

  return (
    <div>
      <RouteBackButton />
      <HighlightExecutor
        schemaAndLanguage={schemaAndLanguage}
        setColorSchema={(event) => {
          setSchemaAndLanguage({
            ...schemaAndLanguage,
            colorSchema: event.target.value,
          });
        }}
        setLanguage={(event) => {
          setSchemaAndLanguage({
            ...schemaAndLanguage,
            language: event.target.value,
          });
        }}
      />
    </div>
  );
}
