import App from "app/lib/main";
import { TargetPlatform } from "@plugin-sdk/core";

export default function FigmaInitTriggerPage() {
  return <App platform={TargetPlatform.figma} />;
}
