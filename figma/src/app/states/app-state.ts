import { atom } from "recoil";

export enum WorkspaceMode {
    code,
    design,
    content,
    toolbox,
    settings,
}

export enum WorkScreen {
    code,
    icon,
    lint,
    g11n,
    dev,
    slot,
    desing_button_maker,
    tool_font_replacer
}


const appWorkspaceModeAtom = atom({
    key: 'app-workspace-mode',
    default: undefined!
})

const appWorkScreeAtom = atom({
    key: 'app-work-screen',
    default: undefined!
})