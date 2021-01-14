import { formatCode } from "dart-style"

// formatter contains some issue. https://github.com/Dart-Code/Dart-Code/issues/2822
export function format(code: string): string {
    try {
        const formatted = formatCode(code);
        return formatted.code;
    } catch (e) {
        console.error(e);
        return code;
    }
}
