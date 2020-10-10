
export function getTextStyleById(id: string): TextStyle {
    if (id === undefined || id === null) {
        throw `the parameter id of ${id} is not valid. maybe your text does not have a assiged textstyle`;
    }
    for (const s of figma.getLocalTextStyles()) {
        if (id === s.id) {
            return s;
        }
    }
    throw `text style of id "${id}" is not found by api`;
}