import { detectIfScreen } from "@reflect.bridged.xyz/detection/lib/screen.detection";
import { isRouteAction } from "../interpreter/action.interpret";

export function makeRoutes(): Array<string> {
    const routes = Array<string>()
    const allScreenReactions = fetchAllActionsGlobal({
        onlyScreen: true
    })

    for (const id of Object.keys(allScreenReactions)) {
        const singleScreenReactions: Reaction[] = allScreenReactions[id]
        const validReactions = singleScreenReactions.filter((r) => isRouteAction(r))
        for (const reaction of validReactions) {
            if (reaction.action.type == "NODE") {
                routes.push(reaction.action.destinationId)
            }
        }
    }
    return routes
}


function fetchAllActionsGlobal(options?: {
    onlyScreen: boolean
}): Map<string, Array<Reaction>> {

    const filter = options?.onlyScreen ? (n: SceneNode): boolean => {
        // as any type casting might cause an error afterwards.
        return detectIfScreen(n as any).result
    } : () => true

    let reactions = new Map<string, Array<Reaction>>();
    figma.root.children.forEach(page => {
        page.children.forEach(node => {
            if (filter(node))
                reactions = new Map([...reactions, ...fetchAllActionsUnderNode(node)])
        })
    });
    return reactions
}

function fetchAllActionsUnderNode(node: SceneNode): Map<string, Array<Reaction>> {
    let reactions = new Map<string, Array<Reaction>>();
    if ('reactions' in node) {
        reactions[node.id] = node.reactions
    }
    if ('children' in node) {
        reactions = new Map<string, Array<Reaction>>([...reactions, ...fetchAllActionsUnderNode(node)])
    }
    return reactions;
}