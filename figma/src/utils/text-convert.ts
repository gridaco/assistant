
// Convert generic named weights to numbers, which is the way tailwind understands
export function convertFontWeight(weight: string): "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" {
  weight = weight.toLowerCase();
  switch (weight) {
    case "thin":
      return "100";
    case "extra light":
      return "200";
    case "light":
      return "300";
    case "regular":
      return "400";
    case "medium":
      return "500";
    case "semi bold":
      return "600";
    case "semibold":
      return "600";
    case "bold":
      return "700";
    case "extra bold":
      return "800";
    case "heavy":
      return "800";
    case "black":
      return "900";
    default:
      return "400";
  }
}
