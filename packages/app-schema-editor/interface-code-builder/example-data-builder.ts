import {
  Identifier,
  StringLiteral,
  VariableDeclaration,
  ObjectLiteralExpression,
  PropertyAssignment,
  TypeReference,
  stringfy,
  nameit,
  NameCases,
} from "coli";

export function buildeExampleDataDeclaration({
  name,
  interfaceName,
  properties,
  options = {
    no_return_when_empty: true,
  },
}: {
  name: string;
  interfaceName?: string;
  properties?: { [string: string]: string };
  options?: {
    no_return_when_empty?: boolean;
  };
}): string {
  if (options.no_return_when_empty) {
    if (!properties || Object.keys(properties).length == 0) {
      return;
    }
  }

  const vari = new VariableDeclaration(name, {
    kind: "const",
    type: new TypeReference({
      typeName: new Identifier(interfaceName),
    }),
    initializer: new ObjectLiteralExpression({
      properties: Object.keys(properties).map((k) => {
        return new PropertyAssignment({
          name: new Identifier(nameit(k, { case: NameCases.camel }).name),
          initializer: new StringLiteral(properties[k]),
        });
      }),
    }),
  });

  return stringfy(vari, {
    language: "typescript",
  });
}
