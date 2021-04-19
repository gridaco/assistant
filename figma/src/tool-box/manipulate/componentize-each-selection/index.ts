export type NameTransformationOption =
  | "preserve"
  | "auto"
  | "template"
  | "new-fixed";

/**
 * bulk mode of `createComponentFrom`
 * @param target
 * @param options
 */
export function createComponentFromSelection(
  target: SceneNode[],
  options: {
    name?: {
      translate: NameTransformationOption;
      with: string;
    };
  }
) {
  target.map((t) => createComponentFrom(t, options));
}

/**
 * creates new component node from input with options that support various transformation such as name transform
 * @param target
 * @param options
 */
export function createComponentFrom(
  target: SceneNode,
  options: {
    name?: {
      translate: NameTransformationOption;
      with: string;
    };
  }
) {
  // create new empty component since figma does not have api to convert existing node as a component
  const newComponent = figma.createComponent();

  // align position / transform as the original node
  newComponent.x = target.x;
  newComponent.y = target.y;
  newComponent.resize(target.width, target.height);

  // insert an existing node into newly created component
  newComponent.insertChild(0, target);

  // set a name of component with options handling
  newComponent.name = translateName({
    from: target.name,
    to: options.name?.with,
    fallback: newComponent.name,
    translate: options.name.translate,
  });

  newComponent.description = `converted from origin:${target.name} by bridged assistant`;
}

/**
 * *translate here means transformation. (not lingual translation)
 */
function translateName(params: {
  from: string;
  to?: string;
  fallback?: string;
  translate?: NameTransformationOption;
}): string {
  const { from, to, fallback, translate } = params;
  if (translate) {
    switch (translate) {
      case "auto":
        return fallback ?? from;
      case "new-fixed":
        if (!to) {
          throw `"new-fixed" translation requires input "to". none was givven (use "auto" instead to avoid this error)`;
        }
        return to;
      case "preserve":
        return from;
      case "template":
        throw "template mode is not yet supported";
      default:
        throw `${translate} mode is not supported`;
    }
  } else {
    // if no translate option provided, return as is
    return from;
  }
}
