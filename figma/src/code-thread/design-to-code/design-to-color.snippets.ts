// ------------------------------------------------
// --------------------FLUTTER---------------------
// ------------------------------------------------

import { Color } from "@reflect-ui/core";

/**
 * desired output:
 *
 * 1. `Colors.white` - named material color if available
 * 2. `new Color(0xFFFFFF)` - hex color if named color is not available
 * 3. `Theme.of(context).colorScheme.error` via extension - [reference](https://crizantlai.medium.com/flutter-how-to-extend-themedata-b5b987a95bb5)
 */
export function makeFlutterColorSnippets() {
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
export function makeFlutterColorschemeExtensionDeclarationSnippet() {
  //
}

/**
 * desired output:
 *
 * ```dart
 * Theme.of(context).colorScheme.success
 * ```
 */
export function makeFlutterColorschemeExtensionUsageSnippet() {
  ///
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
