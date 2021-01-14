import React from "react"

/**
 * this is a data structure of the meta data to be linked with a common component in existing design system.
 */
interface DefaultComponentMetaDataSchema {
    console?: string
    box?: string
    storybook?: string
    docs?: string

    /**
     * custom docs or 
     */
    docsUrl?: string
    /**
     * the target file / directory url indicating this component on git repository.
     */
    gitUrl?: string
    name?: string
}

export function MetaEditorScreen() {
    return <>

    </>
}