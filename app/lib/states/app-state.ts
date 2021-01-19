import { atom } from "recoil";

export enum WorkspaceMode {
    code,
    design,
    content,
    toolbox,
    settings,
}

export enum WorkScreen {
    code = 'code',
    icon = 'icon',
    lint = 'lint',
    g11n = 'g11n',
    dev = 'dev',
    slot = 'slot',
    desing_button_maker = 'desing_button_maker',
    tool_font_replacer = 'tool_font_replacer',
    tool_meta_editor = 'tool_meta_editor',
    tool_batch_meta_editor = 'tool_batch_meta_editor'
}

export type ReleaseChannel = 'release' | 'beta' | 'alpha'
export interface ReleaseVisibilityPreference {
    screen: WorkScreen
    allowedChannel: ReleaseChannel
}


const appWorkspaceModeAtom = atom({
    key: 'app-workspace-mode',
    default: undefined!
})

const appWorkScreeAtom = atom({
    key: 'app-work-screen',
    default: undefined!
})