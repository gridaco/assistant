import * as React from "react";
import { SchemaAndLanguage } from "../models/schema-and-language";
import { colorschema_list } from "../color-schema";
import { language_list } from "../language";
import { set_syntax_highlight_preferences } from "../preferences";
import Select from "./select";
import { fromApp } from "../__plugin/event";
import { BlackButtonStyle } from "@ui/core/button-style";
import styled from "@emotion/styled";

interface Props {
  schemaAndLanguage: SchemaAndLanguage;
  setColorSchema: (event) => void;
  setLanguage: (event) => void;
}

const runHighlight = (schemaAndLanguage: SchemaAndLanguage) => {
  fromApp({ type: "CHANGE_COLOR", schemaAndLanguage });
  set_syntax_highlight_preferences(schemaAndLanguage);
};

const HighlightExecutor: React.FC<Props> = ({
  schemaAndLanguage,
  setColorSchema,
  setLanguage,
}: Props) => {
  return (
    <div className="box">
      <div className="flex">
        <div className="flexChild">
          <Select
            label={"Color Schema"}
            current={schemaAndLanguage.colorSchema}
            collection={colorschema_list}
            onChange={(event) => {
              setColorSchema(event);
            }}
          />
        </div>
        <div className="flexChild">
          <Select
            label={"Language"}
            current={schemaAndLanguage.language}
            collection={language_list}
            onChange={(event) => {
              setLanguage(event);
            }}
          />
        </div>
      </div>
      <Button
        onClick={() => {
          runHighlight(schemaAndLanguage);
        }}
      >
        Run
      </Button>
    </div>
  );
};

const Button = styled.button`
  ${BlackButtonStyle}
  width: 100%;
`;

export default HighlightExecutor;
