import { BondageReact, IconButton, PlainText } from "bondage-react";

export function NotImplemented() {
  return (
    <BondageReact>
      <IconButton
        position={{ left: 1815, top: 75, width: 90, height: 90 }}
        icon="./Icons/Exit.png"
        onClick={() => PreferenceSubscreenExtensionsExit()}
      />
      <PlainText
        position={{ left: 600, top: 200, width: 800, height: 200 }}
        align="center"
        verticalAlign="center"
        text="Not implemented"
      />
      <PlainText
        position={{ left: 600, top: 400, width: 800, height: 200 }}
        align="left"
        verticalAlign="bottom"
        text="Not implemented"
      />
      <PlainText
        position={{ left: 600, top: 600, width: 800, height: 200 }}
        align="right"
        verticalAlign="top"
        text="Not implemented"
      />
    </BondageReact>
  );
}
