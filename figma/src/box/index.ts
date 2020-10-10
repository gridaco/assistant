const TEST_STORYBOOK_ROOT = "https://5f7d1f04988db70022c94c9a-bxsgusmnlc.chromatic.com"
export function openOnStoryBook(path: string){
    open(`${TEST_STORYBOOK_ROOT}/?path=${path}`)
}