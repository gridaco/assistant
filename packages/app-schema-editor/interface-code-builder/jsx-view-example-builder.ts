import {
  Identifier,
  JSX,
  JSXAttribute,
  Snippet,
  StringLiteral,
  TypeReference,
  VariableDeclaration,
  stringfy,
} from "coli";
import { nameit, NameCases } from "@coli.codes/naming";

export function jsxViewExampleBuilder(p: {
  varName?: string;
  viewTag: string;
  typeReference: string;
  properties: { [key: string]: string };
}): string {
  const _attrs = Object.keys(p.properties).map((k) => {
    const _v = p.properties[k];
    const keyname = nameit(k, {
      case: NameCases.camel,
    }).name;
    return new JSXAttribute(keyname, new StringLiteral(_v));
  });

  const customTagBuilder = JSX.tag(p.viewTag, {
    attributes: _attrs,
  });

  const jsx_coli = customTagBuilder.make();

  let final_coli;
  if (p.varName) {
    final_coli = new VariableDeclaration(p.varName, {
      kind: "const",
      type: new TypeReference({
        typeName: new Identifier(p.typeReference),
      }),
      initializer: jsx_coli,
    });
  } else {
    final_coli = jsx_coli;
  }

  return stringfy(final_coli, {
    language: "tsx",
  });
}
