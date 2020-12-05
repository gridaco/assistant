import React from "react"
import { Button } from "@material-ui/core";


export function FontReplacerScreen() {

    function onReplaceFontClick() {
        console.log('onReplaceFontClick')
    }


    return <Button onClick={onReplaceFontClick}>replace fonts to roboto regular</Button>
}