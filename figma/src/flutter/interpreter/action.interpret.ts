// interpret https://www.figma.com/plugin-docs/api/Action/


export function interpretAction(action: Action, trigger: Trigger) {

    switch (trigger.type) {
        case "ON_CLICK":
            break;
        case "ON_HOVER":
            break;
        case "ON_PRESS":
            break
        case "ON_DRAG":
            break;
        case "AFTER_TIMEOUT":
            // @ts-ignore
            const timeout = trigger.timeout
            break;
        case "MOUSE_ENTER":
            // @ts-ignore
            const timeout = trigger.delay
            break;
        case "MOUSE_LEAVE":
            // @ts-ignore
            const timeout = trigger.delay
            break;
        case "MOUSE_UP":
            // @ts-ignore
            const timeout = trigger.delay
            break;
        case "MOUSE_DOWN":
            // @ts-ignore
            const timeout = trigger.delay
            break;
    }


    switch (action.type) {
        case "BACK" || "CLOSE":
            // pop route
            // cloes -> pop
            // back -> pop until
            break;
        case "NODE":
            // route
            switch (action.navigation) {
                case "NAVIGATE":
                    // push route
                    break;
                case "OVERLAY":
                    // show dialog

                    // handle animation type
                    switch (action.transition.type) {
                        case "DISSOLVE":
                            break;
                        case "SMART_ANIMATE":
                            break
                        case "MOVE_IN":
                            break
                        case "MOVE_OUT":
                            break
                        case "PUSH":
                            break
                        case "SLIDE_IN":
                            break
                        case "SLIDE_OUT":
                            break
                    }

                    break;
                case "SWAP":
                    // push replacement
                    break;
            }
            break;
        case "URL":
            const url = action.url
            // open url
            break;
    }
}
