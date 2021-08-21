import App from "app/lib/main";
import { TargetPlatform } from "app/lib/utils/plugin-init/init-target-platform";

export default function FigmaInitTriggerPage() {
  return <App platform={TargetPlatform.figma} />;
}
