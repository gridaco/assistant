// TODO WIP
export function createTextStyle(args: {
    name: string
    description?: string
    fontSize: number
    fontName: FontName
}) {
    const style = figma.createTextStyle()
    style.fontName = args.fontName;
    style.fontSize = args.fontSize;
    style.name = args.name;
    style.description = args.description;
}
