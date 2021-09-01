export function buildeExampleData(p: {
  name: string;
  interfaceName?: string;
  properties: { [string: string]: string };
}): string {
  return `const data${
    p.interfaceName ? ` :${p.interfaceName}` : ""
  } = ${JSON.stringify(p.properties, null, 2)}`;
}
