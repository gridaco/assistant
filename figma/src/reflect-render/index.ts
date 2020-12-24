export function drawButtons() {
    const marginBetweenGeneratedElements = 50
    let xPos = 0
    const colors = ['#A58EFF', '#FF8E8E', '#7435C3',]
    const randomizeBorderRadius = (): number => { return getRandomInt(0, 24) }
    const randomizeTextSize = (): number => { return getRandomInt(12, 32) }
    const randimizeShadowBlur = (): number => { return getRandomInt(0, 16) }
    for (let i: number = 0; i < 50; i++) {
        const buttonFrame = figma.createFrame()
        const width = 200 + i * 2
        const height = 56

        // resize the frame
        buttonFrame.resize(width, height)

        // remove all fills
        buttonFrame.fills = []

        // disable clip content
        buttonFrame.clipsContent = false

        // align with others
        buttonFrame.x = xPos
        xPos += width + marginBetweenGeneratedElements

        const base = figma.createRectangle()
        base.resize(width, height)


        const borderRadius = randomizeBorderRadius()
        base.cornerRadius = borderRadius

        base.effects = [
            // shadow
            {
                type: "DROP_SHADOW",
                color: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0.25
                },
                radius: randimizeShadowBlur(),
                offset: {
                    x: 0,
                    y: 4
                },
                visible: true,
                blendMode: 'NORMAL'
            }
        ]

        const text = figma.createText()

        figma.loadFontAsync({ family: "Roboto", style: "Regular" }).then(() => {
            text.characters = 'click me'

            // randomize font size
            text.fontSize = randomizeTextSize()


            const textWidthAfterContentFilled = text.width
            const textHeightAfterContentFilled = text.height
            // center horizontally
            text.x = (width / 2) - (textWidthAfterContentFilled / 2)
            // center vertically
            text.y = (height / 2) - (textHeightAfterContentFilled / 2)
        })


        // base to downer
        buttonFrame.insertChild(0, base)
        // text to upper
        buttonFrame.insertChild(1, text)
    }
}



/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}