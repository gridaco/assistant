import { Color, ColorFormat } from "@reflect.bridged.xyz/core/lib/color"
import { colorToRGBA, convertReflectColorToUniversal } from "@reflect.bridged.xyz/core/lib/converters/color.convert"

export async function drawButtons() {
    const marginBetweenGeneratedElements = 50
    let xPos = 0
    const randomizeTextSize = (): number => { return getRandomInt(12, 24) }
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" })


    for (let i: number = 0; i < 50; i++) {
        const buttonFrame = figma.createFrame()
        const colorScheme = generateRandomButonColorSceme()


        const text = figma.createText()
        const textSize = randomizeTextSize()

        text.characters = generateRandomButtonTextContent()

        // randomize font size
        text.fontSize = textSize

        const textColor = colorToRGBA(colorScheme.text, ColorFormat.rgbaF)
        text.fills = [
            {
                type: 'SOLID',
                color: {
                    r: textColor.r,
                    g: textColor.g,
                    b: textColor.b
                },
            }
        ]



        const textWidth = text.width
        const textHegith = text.height
        const minDefaultPadding = 4
        const minRelativePadding = minDefaultPadding * 2 + textHegith / 2
        const minHeight = textHegith + minRelativePadding
        const maxHeight = 56
        const minWidth = textWidth + minRelativePadding
        const maxWidth = 375
        const width = getRandomInt(minWidth, maxWidth)
        const height = getRandomInt(minHeight, maxHeight)

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

        const minWH = Math.min(width, height)
        const borderRadius = generateRandomBorderRadius(minWH)
        base.cornerRadius = borderRadius

        const baseColor = colorToRGBA(colorScheme.base, ColorFormat.rgbaF)
        base.fills = [
            {
                type: 'SOLID',
                color: {
                    r: baseColor.r,
                    g: baseColor.g,
                    b: baseColor.b
                },
                opacity: 1
            }
        ]

        base.effects = [
            // shadow
            generateRandomShadow()
        ]

        generateRandomBorder(colorScheme.border)
        base.strokes = [

        ]


        const textWidthAfterContentFilled = text.width
        const textHeightAfterContentFilled = text.height
        // center horizontally
        text.x = (width / 2) - (textWidthAfterContentFilled / 2)
        // center vertically
        text.y = (height / 2) - (textHeightAfterContentFilled / 2)


        // base to downer
        buttonFrame.insertChild(0, base)
        // text to upper
        buttonFrame.insertChild(1, text)
    }
}

function generateRandomBorder(color: Color | undefined): Paint | undefined {
    if (!color) {
        return {
            type: 'SOLID',
            color: {
                r: 0, g: 0, b: 0
            },
            visible: false
        }
    }

    const convertedColor = colorToRGBA(color, ColorFormat.rgbaF)
    return {
        type: 'SOLID',
        color: {
            r: convertedColor.r,
            g: convertedColor.g,
            b: convertedColor.b,
        },
        visible: chanceBy(0.5)
    }
}

function chanceBy(chance: number = 0.5): boolean {
    return Math.random() >= chance
}


function generateRandomButtonTextContent(): string {
    // replace this set with ui-dataset. https://github.com/bridgedxyz/ui-dataset
    // const set = ['click me', 'buy', 'activate', 'register', 'login']
    const set = [
        "Add customers",
        "Add a customer",
        "OK",
        "Next",
        "Confirm",
        "Complete",
        "Create",
        "Creaet new teams",
        "Create new Workspace",
        "Continue",
        "Share",
        "Skip",
        "Switch",
        "Send",
        "Send invite link",
        "Cancel",
        "View All",
        "Order",
        "Register",
        "Send Payment PDF to email",
        "Select",
        "Write new note",
    ]
    const item = set[Math.floor(Math.random() * set.length)];
    return item
}


/**
 * @param minWH smaller value between width and height
 */
function generateRandomBorderRadius(minWH: number): number {
    // TODO add damping logic
    return getRandomInt(0, minWH)
}


function generateRandomShadow(): Effect {
    // randomize visibility by chance of 50:50
    const visible = Math.random() >= 0.5

    const randimizeShadowBlur = (): number => { return getRandomInt(0, 16) }
    const randomizeOffset = (): { x: number, y: number } => {
        return {
            x: 0,
            y: getRandomInt(0, 16)
        }
    }

    return {
        type: "DROP_SHADOW",
        color: {
            r: 0,
            g: 0,
            b: 0,
            a: getRandomFloat(0, 0.25)
        },
        radius: randimizeShadowBlur(),
        offset: randomizeOffset(),
        visible: visible,
        blendMode: 'NORMAL'
    }
}


interface ButtonColorScheme {
    base: Color
    text: Color,
    border?: Color
}

/**
 * generates random button color scheme. the set of colors containing background, and foreground color values.
 * default by active color scheme.
 */
function generateRandomButonColorSceme(): ButtonColorScheme {
    // const colors = ['#A58EFF', '#FF8E8E', '#7435C3',]
    const schemes: Array<ButtonColorScheme> = [
        {
            base: '#151818',
            text: '#FFFFFF'
        },
        {
            base: '#5B7FFF',
            text: '#FFFFFF'
        },
        {
            base: '#FF835B',
            text: '#FFFFFF'
        },
        {
            base: '#E93843',
            text: '#FFFFFF'
        },
        {
            base: '#FFE175',
            text: '#000000'
        },
        //

        {
            base: '#4DD091',
            text: '#FFFFFF'
        },
        {
            base: '#4AB868',
            text: '#FFFFFF'
        },
        {
            base: '#FFFFFF',
            text: '#4F60FF',
            border: '#4F60FF'
        },
        {
            base: '#F15223',
            text: '#FFFFFF',
        },
        {
            base: '#06C1FF',
            text: '#FFFFFF'
        },

        //
        {
            base: '#8A24FF',
            text: '#FFFFFF'
        },
        {
            base: '#5041AB',
            text: '#FFFFFF'
        },
        {
            base: '#4A5CB8',
            text: '#FFFFFF'
        },
        {
            base: '#FFFFFF',
            text: '#E15869',
            border: '#E15869'
        },
        {
            base: '#71C297',
            text: '#FFFFFF'
        },
    ]

    return schemes[Math.floor(Math.random() * schemes.length)]
}


/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max): number {
    return Math.random() * (max - min) + min;
}