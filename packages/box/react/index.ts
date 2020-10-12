import * as path from "path";
import { parse, PreparedComponentDoc } from "react-docgen"
interface ComponentData {
    description
    snippet
    lang
}

interface ComponentConfig {
    code: string
    fileName: string
}

export class ReactBoxSnippetGenerator {
    supportedFileExtensions = [".js", ".jsx", ".ts", ".tsx"];
    tsExtensions = [".ts", ".tsx"];


    async process(context: ComponentConfig): Promise<ComponentData> {

        console.log("context", context)
        const rawReactDocs = parse(context.code, null, null, {
            filename: context.fileName, //path.resolve(),
            babelrc: false,
        });

        // TODO https://github.com/reactjs/react-docgen/issues/470

        console.log("rawReactDocs", rawReactDocs)

        const rawProps = rawReactDocs.props || {};

        const props = Object.keys(rawProps)
            .filter(name => name !== "children")
            // .filter(name => rawProps[name].type || rawProps[name].tsType || rawProps[name].flowType)
            .map(name => ({ name, value: rawProps[name] }));
        console.log("props", props)

        const hasChildren = !!rawProps.children;

        const snippet = await this.generateSnippet({
            description: rawReactDocs.description,
            componentName: rawReactDocs.displayName,
            props,
            hasChildren
        });

        // TODO maybe generate a markdown propTable as description?
        const { description } = rawReactDocs;
        const lang = this.tsExtensions.includes(path.extname(context.fileName))
            ? "tsx" //PrismLang.ReactTSX
            : "jsx" //PrismLang.ReactJSX;

        return { description, snippet, lang };
    }

    supports(x: ComponentConfig): boolean {
        const fileExtension = path.extname(x.fileName);

        return this.supportedFileExtensions.includes(fileExtension);
    }

    private async generateSnippet(preparedComponentDoc: PreparedComponentDoc): Promise<string> {
        const template = await require("./template/snippet.pug");
        return await template(preparedComponentDoc);
    }
}