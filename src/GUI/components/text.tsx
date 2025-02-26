import { calculatePositionStyle } from "./utils";

export function PlainText({
  canvasPosition,
  text,
  position,
  config,
}: {
  canvasPosition: Position;
  text: string;
  position: Position;
  config?: {
    fontSize?: number;
    align?: "center" | "left" | "right";
    shadow?: boolean;
  };
}) {
  const fontSize = config?.fontSize || 36;
  const align = config?.align || "left";
  const shadow = config?.shadow || false;

  return (
    <div
      style={{
        ...calculatePositionStyle(canvasPosition, position),
        width: "fit-content",
        fontSize: `${(canvasPosition.width / 2000) * fontSize}px`,
        display: "flex",
        justifyContent: "center",
        textAlign: align,
        textShadow: shadow ? "1px 1px 2px gray" : "none",
      }}
      class="plain-text"
    >
      {text}
    </div>
  );
}
