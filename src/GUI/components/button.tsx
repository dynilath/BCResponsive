import { useEffect, useState } from "preact/hooks";
import { Binding, useBinding } from "../hooks/binding";
import { calculatePositionStyle } from "./utils";
import { h } from "preact";

export function IconButton({
  canvasPosition,
  icon,
}: {
  canvasPosition: Position;
  icon: string;
}) {
  return (
    <button
      style={{
        ...calculatePositionStyle(canvasPosition, {
          x: 1815,
          y: 75,
          width: 90,
          height: 90,
        }),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: `${canvasPosition.width / 1000}px solid`,
        borderRadius: 0,
        padding: 0,
      }}
      onClick={() => {
        console.log("clicked");
        PreferenceSubscreenExtensionsClear();
      }}
      class={"bondage-react icon-button"}
    >
      <img
        src={icon}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
        }}
      />
    </button>
  );
}

export function TextRoundButton({
  canvasPosition,
  text,
  position,
}: {
  canvasPosition: Position;
  text: string;
  position: Position;
}) {}

export function Switch({
  canvasPosition,
  position,
  binding,
}: {
  canvasPosition: Position;
  position: Position;
  binding: Binding<boolean>;
}) {
  const [state, setState] = useBinding(binding);

  return (
    <button
      style={{
        ...calculatePositionStyle(canvasPosition, position),
        display: "flex",
        justifyContent: "center",
        alignItems: state ? "flex-end" : "flex-start",
        border: `${canvasPosition.width / 1000}px solid`,
        borderRadius: 0,
        padding: 0,
      }}
      onClick={() => {
        binding.value = !state;
      }}
      class={"switch"}
    >
      <div
        style={{
          width: "50%",
          height: "50%",
          backgroundColor: binding.value ? "green" : "red",
        }}
      ></div>
    </button>
  );
}
