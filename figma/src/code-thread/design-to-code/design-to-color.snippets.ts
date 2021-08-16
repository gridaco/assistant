// ------------------------------------------------
// --------------------FLUTTER---------------------
// ------------------------------------------------

import { Color, ColorFormat, convert_colors } from "@reflect-ui/core";

/**
 * desired output:
 *
 * 1. `Colors.white` - named material color if available
 * 2. `new Color(0xFFFFFF)` - hex color if named color is not available
 * 3. `Theme.of(context).colorScheme.error` via extension - [reference](https://crizantlai.medium.com/flutter-how-to-extend-themedata-b5b987a95bb5)
 */
export function makeFlutterColorSnippets(): string[] {
  const _1_named_color_snippet = "";
  const _2_hex_color_snippet = "";
  const _3_theme_color_snippet = "";
  return [_1_named_color_snippet, _2_hex_color_snippet, _3_theme_color_snippet];
  //
}

interface FlutterExtendedColorScheme_SingleColorRepresentation {
  /** the value of color */
  color: Color;
  /** the name of color as final representative */
  name: string;
  /** the name of the extension `extension THIS_NAME on ColorScheme { ... }`*/
  customColorSchemeName: string;
}

/**
 * desired output:
 *
 * ```dart
 * extension CustomColorScheme on ColorScheme {
    Color get success => const Color(0xFF28a745);
    Color get info => const Color(0xFF17a2b8);
    Color get warning => const Color(0xFFffc107);
    Color get danger => const Color(0xFFdc3545);
}
 * ```
 *
 */
export function makeFlutterColorschemeExtensionDeclarationSnippet(prop: {
  seed: FlutterExtendedColorScheme_SingleColorRepresentation;
}): string {
  const { seed } = prop;
  const color_as_hex = convert_colors.convertReflectColorToUniversal(
    seed.color,
    ColorFormat.hex8
  );
  return `///
/// this is the extension of the color scheme. this is required to extend your theme.
///
extension ${seed.customColorSchemeName} on ColorScheme {
    // ...
    Color get ${seed.name} => const Color(0x${color_as_hex});
    // ...
}`;
  //
}

/**
 * desired output:
 *
 * ```dart
 * Theme.of(context).colorScheme.success
 * ```
 */
export function makeFlutterColorschemeExtensionUsageSnippet(props: {
  seed: { name: string };
}) {
  return `Theme.of(context).colorScheme.${props.seed.name};
`;
}
// ------------------------------------------------
// --------------------FLUTTER---------------------
// ------------------------------------------------

// ------------------------------------------------
// ---------------------REACT----------------------
// ------------------------------------------------
export function makeReactColorSnippets() {
  //
}
// ------------------------------------------------
// ---------------------REACT----------------------
// ------------------------------------------------
