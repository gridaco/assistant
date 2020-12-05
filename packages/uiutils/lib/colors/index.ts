

export interface RGB {
    r: number
    g: number
    b: number
}

export interface RGBA {
    r: number
    g: number
    b: number
    a: number
}

export function rgbTo6hex(color: RGB | RGBA): string {
    const hex = ((color.r * 255) | (1 << 8)).toString(16).slice(1) +
        ((color.g * 255) | (1 << 8)).toString(16).slice(1) +
        ((color.b * 255) | (1 << 8)).toString(16).slice(1);

    return hex;
}

export function rgbTo8hex(color: RGB, alpha: number): string {
    // when color is RGBA, alpha is set automatically
    // when color is RGB, alpha need to be set manually (default: 1.0)
    const hex = ((alpha * 255) | (1 << 8)).toString(16).slice(1) +
        ((color.r * 255) | (1 << 8)).toString(16).slice(1) +
        ((color.g * 255) | (1 << 8)).toString(16).slice(1) +
        ((color.b * 255) | (1 << 8)).toString(16).slice(1);

    return hex;
}

export const white: RGBA = { r: 1, g: 1, b: 1, a: 1 }
export function rgbaTo8Hex(color: RGBA, fallback: RGBA = white): string {
    try {
        return rgbTo8hex(color, color.a);
    } catch (e) {
        console.log('error while converting rgba to 8hex. returning fallback.')
        return rgbTo8hex(fallback, fallback.a)
    }
}



// from https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
export function calculateContrastRatio(color1: RGB, color2: RGB) {
    const color1luminance = luminance(color1);
    const color2luminance = luminance(color2);

    const contrast =
        color1luminance > color2luminance
            ? (color2luminance + 0.05) / (color1luminance + 0.05)
            : (color1luminance + 0.05) / (color2luminance + 0.05);

    return 1 / contrast;
}

export function luminance(color: RGB) {
    const a = [color.r * 255, color.g * 255, color.b * 255].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
