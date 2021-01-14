import React from "react"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"

interface MetaDataFieldDef {
    name: string
    type: "text" | "url"
}


/**
 * this is a data structure of the meta data to be linked with a common component in existing design system.
 */
// console: <MetaDataField>{
//     name: '',
//     type: ''
// },
// box?: string,
// storybook?: string,
// docs?: string,
// /**
//  * custom docs or
//  */
// docsUrl?: string,
// /**
//  * the target file / directory url indicating this component on git repository.
//  */
// gitUrl?: string,
// name?: string
const DefaultComponentMetaDataSchema: ReadonlyArray<MetaDataFieldDef> = [
    {
        name: "name",
        type: "text"
    },
    {
        name: "storybook",
        type: "text"
    },
    {
        name: "docsUrl",
        type: "url"
    },
    {
        name: "gitUrl",
        type: "url"
    },
    {
        name: "codeSnippet",
        type: "text"
    }
]


export function MetaEditorScreen() {

    return <>
        {
            DefaultComponentMetaDataSchema.map(e => {
                return <div key={e.name} style={{
                    padding: 16
                }}>
                    <MetaDataEditableField initial={undefined} name={e.name} onUpdate={(s: string) => {
                        console.log('value updated on', e.name, s)
                    }} />
                </div>
            })
        }
        <Button variant='outlined'>Save</Button>
    </>
}

function MetaDataEditableField(props: {
    initial: string
    name: string
    onUpdate: (string) => void
}) {

    const handleOnChange = (e: any) => {
        const newvalue = e.target.value as string
        props.onUpdate(newvalue)
    }

    return <>
        <Typography>
            {props.name}
        </Typography>
        <TextField fullWidth defaultValue={props.initial} onChange={handleOnChange} />
    </>
}