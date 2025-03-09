import { render } from "preact";
import { useState } from "preact/hooks";
import { MainSettingComponent } from "./mainPage";
import { GUIPage } from "./GUITypes";
import { BondageReact, PlainText } from "bondage-react";
import { NotImplemented } from "./nImplPage";

export function PageRouter() {
  const [page, setPage] = useState("home" as GUIPage);

  if (page === "home") {
    return <MainSettingComponent setPage={setPage} />;
  }

  return <NotImplemented />;
}

const components = new Map<string, HTMLElement>();

export const UI = {
  load(containerId: string) {
    const container = document.createElement("div");
    container.id = containerId;
    components.set(containerId, container);
    document.body.appendChild(container);
    render(<PageRouter />, container);
  },

  loadIfNotLoaded(containerId: string) {
    if (!components.has(containerId)) {
      this.load(containerId);
      return true;
    }
    return false;
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
