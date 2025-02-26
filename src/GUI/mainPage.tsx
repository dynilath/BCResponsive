import { render, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Icons } from "./Icons";
import { GetText } from "../i18n";
import { IconButton, PlainText } from "./components";

interface Position {
  y: number;
  x: number;
  width: number;
  height: number;
}

function TextComponent({ text }: { text: string }) {
  return <div>{text}</div>;
}

function positionToStyle(canvasPosition: Position, position: Position) {
  const ratio = canvasPosition.width / 2000;

  const style = {
    position: "fixed",
    left: `${canvasPosition.x + position.x * ratio}px`,
    top: `${canvasPosition.y + position.y * ratio}px`,
    width: `${position.width * ratio}px`,
    height: `${position.height * ratio}px`,
  };
  return style;
}

function positionWidthHeight(
  canvasPosition: Position,
  wh: { width: number; height: number }
) {
  const ratio = canvasPosition.width / 2000;
  const style = {
    width: `${wh.width * ratio}px`,
    height: `${wh.height * ratio}px`,
  };
  return style;
}

function MainSettingComponent({
  mainCanvas,
}: {
  mainCanvas: HTMLCanvasElement;
}) {
  const rect = mainCanvas.getBoundingClientRect();
  const [canvasPosition, setPosition] = useState<Position>({
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  });

  useEffect(() => {
    const handleResize = () => setPosition(mainCanvas.getBoundingClientRect());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        ...positionToStyle(canvasPosition, {
          y: 0,
          x: 0,
          width: 2000,
          height: 1000,
        }),
      }}
    >
      <IconButton {...{ canvasPosition, icon: "./Icons/Exit.png" }} />

      <PlainText
        {...{
          canvasPosition,
          text: GetText("responsive_setting_title"),
          position: { x: 200, y: 100, width: 400, height: 50 },
          config: { shadow: true },
        }}
      />

      <PlainText
        {...{
          canvasPosition,
          text: GetText("MainMenu::MainSwitch"),
          position: { x: 200, y: 200, width: 400, height: 50 },
        }}
      />
    </div>
  );
}

const components = new Map<string, HTMLElement>();

export const UI = {
  load(containerId: string) {
    const mainCanvas = document.getElementById(
      "MainCanvas"
    ) as HTMLCanvasElement;

    const container = document.createElement("div");

    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.className = "bondage-react";

    container.id = containerId;
    document.body.appendChild(container);
    components.set(containerId, container);

    render(<MainSettingComponent mainCanvas={mainCanvas} />, container);
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
