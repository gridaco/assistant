import { Color, ColorFormat } from "@reflect.bridged.xyz/core/lib/color"
import { reflectColorToFigmaColor, reflectColorToFigmaRGB, reflectColorToFigmaRGBA } from "@bridged.xyz/design-sdk/lib/figma/converters/color.convert"
export async function drawButtons() {
    const marginBetweenGeneratedElements = 50
    let xPos = 0
    let yPos = 0
    let i = 0
    const randomizeTextSize = (): number => { return getRandomInt(12, 24) }

    for (let c: number = 0; c < 100; c++) {
        yPos += 200;
        xPos = 0;

        for (let r: number = 0; r < 100; r++) {
            i++;

            const fontName = generateRandomFont()
            await figma.loadFontAsync(fontName)
            const buttonFrame = figma.createFrame()

            buttonFrame.name = `relfect-buttons/with-text-${i}`

            const colorScheme = generateRandomButonColorSceme()



            const text = figma.createText()
            const textSize = randomizeTextSize()

            text.fontName = fontName
            text.characters = generateRandomButtonTextContent()

            // randomize font size
            text.fontSize = textSize

            const textColor = reflectColorToFigmaColor(colorScheme.text)

            text.fills = [
                {
                    type: 'SOLID',
                    color: textColor
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
            buttonFrame.y = yPos
            xPos += width + marginBetweenGeneratedElements

            const base = figma.createRectangle()
            base.resize(width, height)

            const minWH = Math.min(width, height)
            const borderRadius = generateRandomBorderRadius(minWH)
            base.cornerRadius = borderRadius

            const fillIsGradient = chanceBy(0.2)

            if (fillIsGradient) {
                text.fills = [
                    {
                        type: 'SOLID',
                        color: {
                            r: 1,
                            g: 1,
                            b: 1,
                        }
                    }
                ]

                // gradient fill
                const gradient = generateRandomGradient()
                const startColor = gradient.colors[0]
                const endColor = gradient.colors[1]
                base.fills = [
                    {
                        type: 'GRADIENT_LINEAR',
                        gradientTransform: [
                            [1, 1, 0],
                            [1, 1, 1],
                        ],
                        gradientStops: [{
                            color: reflectColorToFigmaRGBA(startColor),
                            position: 0,
                        },
                        {
                            color: reflectColorToFigmaRGBA(endColor),
                            position: 1,
                        },
                        ],
                    },
                ]
            } else {
                // solid fill
                base.fills = [
                    {
                        type: 'SOLID',
                        color: reflectColorToFigmaRGB(colorScheme.base),
                        opacity: 1
                    }
                ]
            }


            base.effects = [
                // shadow
                generateRandomShadow()
            ]

            const border = generateRandomBorder(colorScheme.border)
            base.strokes = [
                border
            ]

            const textWidthAfterContentFilled = text.width
            const textHeightAfterContentFilled = text.height
            // center horizontally
            text.x = (width / 2) - (textWidthAfterContentFilled / 2)
            // center vertically
            text.y = (height / 2) - (textHeightAfterContentFilled / 2)

            // TODO - add constraints


            // base to downer
            buttonFrame.insertChild(0, base)
            // text to upper
            buttonFrame.insertChild(1, text)
        }
    }
}

function generateRandomFont(): FontName {
    const styles = ["Regular", "Medium", "Bold"]
    return {
        family: "Roboto",
        style: styles[Math.floor(Math.random() * styles.length)]
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

    return {
        type: 'SOLID',
        color: reflectColorToFigmaRGB(color),
        visible: chanceBy(0.5)
    }
}

function chanceBy(chance: number = 0.5): boolean {
    return Math.random() <= chance
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
        "Read",
        "Sign up for our newsletter",
        "Shop all Bike",
        "Shop all Skate",
        "Shop all Paddle",
        "Shop all Alpine",
        "Shop all Exercise",
        "Shop all Youth",
        "Shop all Apparel",
        "Shop all Gifts",
        "Adult Bikes",
        "Kids Bikes",
        "Dealers",
        "Shop All Bike",
        "Shop All Single-Speed",
        "Exit",
        "Shop All City Bike",
        "Shop All Beach Cruiser",
        "Shop All Hybrid",
        "Shop All Folding",
        "Shop All Youth",
        "Shop All Trailers",
        "Shop All Car // Bike Racks",
        "Shop All Components & Accessories",
        "Shop All Last Chance",
        "Shop All Skate",
        "Shop All Longboard",
        "Shop All Cruiser",
        "Shop All Skateboard",
        "Shop All Protective Gear",
        "Shop All Paddle",
        "Shop All Adult",
        "Shop All Party",
        "Shop All Accessories",
        "Shop All Alpine",
        "Shop All Snow Helmets",
        "Shop All Snow Goggles",
        "Shop All Snowshoes",
        "Shop All Trekking Poles",
        "Shop All Exercise",
        "Shop All Yoga // Exercise Mats",
        "Shop All Yoga Bolsters",
        "Shop All Meditation Cushions",
        "Shop All Exercise Ball & Bases",
        "Shop All Foam Rollers",
        "Shop All Home Gym",
        "Shop All Bike Child Trailers",
        "Shop All Scooters",
        "Shop All Apparel",
        "Shop All Second Nature Collection",
        "Shop All Eco Collection",
        "Shop All Gifts",
        "Shop All Gift Cards",
        "Shop All Gifts under $50",
        "Shop All Gifts under $75",
        "Shop All Gifts under $150",
        "Shop All Gifts under $200",
        "Shop All Gifts $200 and up",
        "Shop Beaumont",
        "Shop All",
        "Shop Paddle",
        "Shop Youth Bikes",
        "Shop Exercise",
        "Shop Adult Bikes",
        "Shop Now",
        "Find a Dealer",
        "Shop Bikes",
        "Shop Skateboards",
        "Shop Yoga Mats",
        "Shop Trekking Poles",
        "Get a Grid",
        "Next",
        "Get API Keys",
        "Contact",
        "Get Started",
        "Developer Docs",
        "Next step",
        "Lapa Ninja",
        "Get the book",
        "View",
        "Reload Page",
        "+",
        "Buy",
        "Shop",
        "Open the app",
        "Try for 14 days",
        "Get started",
        "Book a demo",
        "Start free trial",
        "Book a call",
        "SIGN UP FREE",
        "Yes",
        "No",
        "Submit",
        "This help content & information",
        "General Help Center experience",

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


interface LiearGradient {
    colors: Color[]
}

function generateRandomGradient(): LiearGradient {
    const gradients: LiearGradient[] = [
        {
            colors: [
                '#FFC7F0',
                '#D4D8FF'
            ]
        },
        {
            colors: [
                '#C84E89',
                '#F05F7A'
            ]
        },
        {
            colors: [
                '#01F5A1',
                '#01DAF5'
            ]
        },
        {
            colors: [
                '#D5EC68',
                '#53E7DE'
            ]
        },
        {
            colors: [
                '#ABDCFF',
                '#0597FF'
            ]
        },
        //
        {
            colors: [
                '#FEB692',
                '#EB5556'
            ]
        },
        {
            colors: [
                '#CD9FFC',
                '#7568F1'
            ]
        },
        {
            colors: [
                '#FFF3B6',
                '#F7436D'
            ]
        },
        {
            colors: [
                '#81FBB8',
                '#29C870'
            ]
        },
        {
            colors: [
                '#E2B0FF',
                '#A045D4'
            ]
        },
        //
        {
            colors: [
                '#FDCE32',
                '#F65755'
            ]
        },
        {
            colors: [
                '#F761A2',
                '#8D1CAB'
            ]
        },
        {
            colors: [
                '#44CBFF',
                '#9709CD'
            ]
        },
        {
            colors: [
                '#5FFCE9',
                '#736FFE'
            ]
        },
        {
            colors: [
                '#E2B0FF',
                '#A045D4'
            ]
        },
        //
        {
            colors: [
                '#F97795',
                '#633BA2'
            ]
        },
        {
            colors: [
                '#FDCF32',
                '#F65855'
            ]
        },
        {
            colors: [
                '#F761A2',
                '#8E1CAB'
            ]
        },
        {
            colors: [
                '#44CBFF',
                '#9709CD'
            ]
        },
        {
            colors: [
                '#FAD7A1',
                '#EA6E72'
            ]
        },
        //
        {
            colors: [
                '#FF96F9',
                '#C42CAD'
            ]
        },
        {
            colors: [
                '#EECE14',
                '#B312FE'
            ]
        },
        {
            colors: [
                '#79F0A5',
                '#0F5DAD'
            ]
        },
        {
            colors: [
                '#FDD719',
                '#E90D06'
            ]
        },
        {
            colors: [
                '#FFF3B1',
                '#CB27FF'
            ]
        },
        //
        {
            colors: [
                '#FFF720',
                '#3DD601'
            ]
        },
        {
            colors: [
                '#65FCF0',
                '#1E71A4'
            ]
        },
        {
            colors: [
                '#6A72FF',
                '#010EFF'
            ]
        },
        {
            colors: [
                '#FE7AF4',
                '#533264'
            ]
        },
        {
            colors: [
                '#F0FF02',
                '#59D0FB'
            ]
        },
        //
        {
            colors: [
                '#FFE784',
                '#FB752C'
            ]
        },
        {
            colors: [
                '#FEA6B8',
                '#212CD2'
            ]
        },
        {
            colors: [
                '#FFA985',
                '#B43260'
            ]
        },
        {
            colors: [
                '#72ECF2',
                '#5254E6'
            ]
        },
        {
            colors: [
                '#FF9D6D',
                '#BC4F76'
            ]
        },
        //
        {
            colors: [
                '#69FF98',
                '#01E5FF'
            ]
        },
        {
            colors: [
                '#3D2769',
                '#BC78EC'
            ]
        },
        {
            colors: [
                '#70F570',
                '#4AC729'
            ]
        },
        {
            colors: [
                '#3C8DE8',
                '#01EAFF'
            ]
        },
        {
            colors: [
                '#FAB2FF',
                '#1A05E6'
            ]
        },
        //
        {
            colors: [
                '#FFA9A8',
                '#FDFF02'
            ]
        },
        {
            colors: [
                '#82FEEF',
                '#F068B5'
            ]
        },
        {
            colors: [
                '#EC4F83',
                '#B208BE'
            ]
        },
        {
            colors: [
                '#6CC1FF',
                '#4F61BC'
            ]
        },
        {
            colors: [
                '#91FDC0',
                '#012862'
            ]
        },
    ]

    return gradients[Math.floor(Math.random() * gradients.length)];
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