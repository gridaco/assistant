interface Component{
    names: string | Array<string>
    source: string
}

const components : Array<Component>= [
    <Component>{
        names: "buttons/primary",
        source: "src/stories/Button.tsx"
    }
]