import { render } from "preact";
import { DataManager } from "../Data";
import { GetText } from "../i18n";
import { IconButton, PlainText, Switch, BondageReact } from "bondage-react";
import { useBCCanvas } from "bondage-react/hooks";
import { createBinding } from "bondage-react/bindings";
import { HorizontalLayout } from "bondage-react";

function MainSettingComponent() {
  const [canvasPosition, setCanvasPosition] = useBCCanvas();

  const enable_binding = createBinding(
    DataManager.instance.data.settings,
    "enabled"
  );

  return (
    <BondageReact>
      <IconButton
        {...{
          position: {
            left: 1815,
            top: 75,
            width: 90,
            height: 90,
          },
          icon: "./Icons/Exit.png",
          onClick: () => {
            PreferenceSubscreenExtensionsExit();
            UI.unload("MainSettingComponent");
          },
        }}
      />

      <PlainText
        {...{
          text: GetText("responsive_setting_title"),
          position: { left: 200, top: 100, width: 400, height: 50 },
          config: { shadow: true },
        }}
      />

      <HorizontalLayout
        {...{
          canvasPosition,
          position: { left: 200, top: 150, width: 600, height: 200 },
        }}
      >
        <Switch
          {...{
            canvasPosition,
            position: { width: 160, height: 80 },
            binding: enable_binding,
          }}
        />
        {/* <PlainText
            {...{
              canvasPosition,
              text: GetText("MainMenu::MainSwitch"),
              position: { width: 200, height: 50 },
            }}
          /> */}
      </HorizontalLayout>
    </BondageReact>
  );
}

const components = new Map<string, HTMLElement>();

export const UI = {
  load(containerId: string) {
    const container = document.createElement("div");
    container.id = containerId;
    components.set(containerId, container);
    document.body.appendChild(container);
    render(<MainSettingComponent />, container);
  },

  loadIfNotLoaded(containerId: string) {
    if (!components.has(containerId)) {
      this.load(containerId);
    }
  },

  unload(containerId: string) {
    const container = components.get(containerId);
    if (container) {
      render(null, container);
      container.remove();
      components.delete(containerId);
    }
  },
};
