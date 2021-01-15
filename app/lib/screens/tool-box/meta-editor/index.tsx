import React, { useState } from "react"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from "@material-ui/core/Switch"
interface MetaDataFieldDef {
    name: string
    type: MetaDataFieldType
}

type MetaDataFieldType = "text" | "url"


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

    const [editable, seteditable] = useState<boolean>(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        seteditable(event.target.checked)
    };

    return <>
        <FormControlLabel
            control={
                <Switch
                    checked={editable}
                    onChange={handleChange}
                    name="editable"
                    color="primary"
                />
            }
            label="editable"
        />
        <MetaDataDisplayForm editable={editable} />
    </>
}

function MetaDataDisplayForm(props: {
    editable: boolean
}) {

    const data = DefaultComponentMetaDataSchema
    if (props.editable) {
        return <>
            {
                data.map(e => {
                    return <div key={e.name} style={{
                        padding: 16
                    }}>
                        <MetaDataEditableField type={e.type} initial={undefined} name={e.name} onUpdate={(s: string) => {
                            console.log('value updated on', e.name, s)
                        }} />
                    </div>
                })
            }
            <Button variant='outlined'>Save</Button>
        </>
    }

    return <>
        {
            data.map((e) => {
                return <div key={e.name} style={{
                    padding: 16
                }}>
                    <MetaDataDisplayField type={e.type} value={undefined} name={e.name} />
                </div>
            })
        }
    </>
}

function MetaDataDisplayField(props: {
    name: string
    value: string
    type: MetaDataFieldType
}) {

    function drawValue() {

        switch (props.type) {
            case "text":
                return <Typography>
                    {props.value}
                </Typography>

            case "url":
                return <Button onClick={() => open(props.value)}>
                    {props.value}
                </Button>
        }
    }

    const valueDisplay = drawValue()


    return <>
        <Typography>
            {props.name}
        </Typography>
        {valueDisplay}
    </>
}

function MetaDataEditableField(props: {
    initial: string
    name: string
    type: MetaDataFieldType
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
