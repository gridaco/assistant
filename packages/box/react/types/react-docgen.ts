declare module "react-docgen" {
    export interface Props {
      [key: string]: PropDescriptor;
    }
  
    export interface ComponentDoc {
      displayName: string;
      description: string;
      props?: Props;
    }
  
    export interface PreparedProp {
      name: string;
      value: Omit<PropDescriptor, "tsType" | "flowType">;
    }
  
    export type PreparedComponentDoc = {
      componentName: string;
      description: string;
      props: PreparedProp[];
      hasChildren: boolean;
    }
  
    export type PropTypeDescriptor = {
      name:
      | "arrayOf"
      | "custom"
      | "enum"
      | "array"
      | "bool"
      | "func"
      | "number"
      | "object"
      | "string"
      | "any"
      | "element"
      | "node"
      | "symbol"
      | "objectOf"
      | "shape"
      | "exact"
      | "union"
      | "elementType";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value?: any;
      raw?: string;
      computed?: boolean;
      description?: string;
      required?: boolean;
    };
  
    export type FlowBaseType = {
      required?: boolean;
      nullable?: boolean;
      alias?: string;
    };
  
    export type FlowSimpleType = FlowBaseType & {
      name: string;
      raw?: string;
    };
  
    export type FlowLiteralType = FlowBaseType & {
      name: "literal";
      value: string;
    };
  
    export type FlowElementsType = FlowBaseType & {
      name: string;
      raw: string;
      elements: Array<FlowTypeDescriptor>;
    };
  
    export type FlowFunctionArgumentType = {
      name: string;
      type?: FlowTypeDescriptor;
      rest?: boolean;
    };
  
    export type FlowFunctionSignatureType = FlowBaseType & {
      name: "signature";
      type: "function";
      raw: string;
      signature: {
        arguments: Array<FlowFunctionArgumentType>;
        return: FlowTypeDescriptor;
      };
    };
  
    export type FlowObjectSignatureType = FlowBaseType & {
      name: "signature";
      type: "object";
      raw: string;
      signature: {
        properties: Array<{
          key: string | FlowTypeDescriptor;
          value: FlowTypeDescriptor;
        }>;
      };
    };
  
    export type FlowTypeDescriptor =
      | FlowSimpleType
      | FlowLiteralType
      | FlowElementsType
      | FlowFunctionSignatureType
      | FlowObjectSignatureType;
  
    export type PropDescriptor = {
      type?: PropTypeDescriptor | FlowTypeDescriptor;
      flowType?: FlowTypeDescriptor;
      tsType?: FlowTypeDescriptor;
      required?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValue?: any;
      description?: string;
    };
  
    // Just minimal type definition of the method to use it
    export function parse(src: string | Buffer,
      resolver?: null,
      handlers?: null,
      options?: { filename: string; babelrc: boolean }): ComponentDoc;
  }