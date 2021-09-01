import {
  Identifier,
  JSX,
  JSXAtrribute,
  Snippet,
  StringLiteral,
  TypeReference,
  VariableDeclaration,
  stringfy,
} from "coli";
import { nameit, NameCases } from "@coli.codes/naming";

export function jsxViewExampleBuilder(p: {
  varName: string;
  viewTag: string;
  typeReference: string;
  properties: { [key: string]: string };
}): string {
  const _attrs = Object.keys(p.properties).map((k) => {
    const _v = p.properties[k];
    const keyname = nameit(k, {
      case: NameCases.camel,
    }).name;
    return new JSXAtrribute(keyname, new StringLiteral(_v));
  });

  const customTagBuilder = JSX.tag(p.viewTag, {
    attributes: _attrs,
  });

  const jsx_coli = customTagBuilder.make();
  const vardec = new VariableDeclaration(p.varName, {
    kind: "const",
    type: new TypeReference({
      typeName: new Identifier(p.typeReference),
    }),
    initializer: jsx_coli,
  });

  return stringfy(vardec, {
    language: "tsx",
  });
}
