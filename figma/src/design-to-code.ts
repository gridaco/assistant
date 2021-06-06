import type { ReflectSceneNode } from "@design-sdk/core/nodes";
import { flutter } from "@designto/code";
import * as react from "@designto/react";
import { tokenize } from "@designto/token";

type InterceptorJobProcessor = () => Promise<void>;
export async function designToFlutter(
  reflectDesign: ReflectSceneNode,
  jobs: InterceptorJobProcessor
) {
  const buildResult = flutter.buildApp(reflectDesign);

  // execution order matters.
  // this will be fixed by having a builder instance. (currently non available)
  await jobs();

  const widget = buildResult.widget;
  const app = flutter.makeApp({
    widget: widget,
    scrollable: buildResult.scrollable,
  });

  return {
    widget,
    app,
  };
}

export function designToReact(reflectDesign: ReflectSceneNode) {
  const tokens = tokenize(reflectDesign);
  const widget = react.buildReactWidget(tokens);
  const app = react.buildReactApp(widget, {
    template: "cra",
  });

  return {
    tokens: tokens,
    widget: widget,
    app: app,
  };
}

export function designToCode() {
  throw "not implemented";
}

// import {
//   ColiBuilder,
//   BaseImportSpecifier,
//   ImportDeclaration,
//   ImportDefaultSpecifier,
//   ImportSpecifier,
// } from "@coli.codes/core";

// /**
//  * A Import Builder with builder pattern.
//  *
//  * **Usage**
//  *
//  * 1. `Import.declare(...)`
//  * 2. `new Import().import(...).from(...)`
//  * 3. `new Import().import(...).from(...).make()`
//  */
// export class Import extends ColiBuilder<ImportDeclaration> {
//   private source: string;
//   private default: ImportDefaultSpecifier;
//   private m_import: ImportSpecifier;
//   private imports: ImportSpecifier[] = [];
//   static declare(source: string): ImportDeclaration {
//     return new ImportDeclaration({
//       source: source,
//     });
//   }

//   from(source: string): this {
//     this.source = source;
//     return this;
//   }

//   /**
//    * set single import default specifier. calling this multiple times will override previous call effect.
//    *
//    * e.g.
//    *
//    * 1. `import a from "a"`
//    * 2. ~~import `{ a }` from "a"~~ **(NOT THIS)**
//    * @param local
//    * @returns
//    */
//   importDefault(local: string): this {
//     this.default = new ImportDefaultSpecifier({
//       local: local,
//     });
//     return this;
//   }

//   /**
//    * adds `{?}` import
//    *
//    * e.g.
//    *
//    * 1. import `{ a }` from "a"
//    * 2. ~~import a from "a"~~ **(NOT THIS)**
//    * @param _import
//    * @returns
//    */
//   import(_import: HandyImport): this {
//     this.m_import = handyImportToImportSpecifier(_import);
//     return this;
//   }

//   /**
//    * add more import. same as `.import(...)`
//    * @param _import
//    * @returns
//    */
//   and(..._import: HandyImport[]): this {
//     _import.forEach((e) => {
//       this.imports.push(handyImportToImportSpecifier(e));
//     });
//     return this;
//   }

//   private get specifiers(): BaseImportSpecifier[] {
//     const final = [];
//     this.default && final.push(this.default);
//     this.m_import && final.push(this.m_import);
//     final.push(...this.imports);
//     return final;
//   }

//   __finalize(): ImportDeclaration {
//     return new ImportDeclaration({
//       specifiers: this.specifiers,
//       source: this.source,
//     });
//   }
// }

// /**
//  * specifies import
//  * e.g.
//  *
//  * 1. import `{ a }` from "a"
//  * 2. import `{a as _}` from "a"
//  */
// type HandyImport = { import: string; as?: string } | string;

// function handyImportToImportSpecifier(_import: HandyImport): ImportSpecifier {
//   if (typeof _import == "string") {
//     return new ImportSpecifier({
//       import: _import,
//     });
//   } else if (typeof _import == "object") {
//     return new ImportSpecifier(_import);
//   }
// }
