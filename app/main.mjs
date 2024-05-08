import { newElement } from "../src/modules/dom.mjs";
import { hdleEvent } from "../src/modules/event.mjs";
import { Router } from "../src/modules/route.mjs";
import { Render } from "./routes/render.mjs";
import { create } from "./utils/create.mjs";
import { itemCount } from "./utils/itemCount.mjs";
import { credits, virtualObj } from "./virtualObj.mjs";

export const render = new Render(),
  routes = new Router({
    "/": render.renderAll,
    "/active": render.renderActive,
    "/completed": render.renderDone,
  });

export const main = () => {
  if (!window.location.href.includes("#"))
    history.pushState({}, "", `${window.location.href}#/`);
  if (
    window.location.href.includes("#") &&
    window.location.href.split("#")[1] != "/"
  )
    history.pushState({}, "", `${window.location.href.split("#")[0]}#/`);

  newElement(virtualObj);
  newElement(credits);

  hdleEvent("keypress", document.getElementById("todo-input"), (e) => {
    if (e.key == "Enter") {
      create();
      console.log("✔ task created successfully");
      itemCount();
      routes.loadCurrentView();
    }
  });

  routes.loadCurrentView();
};
main();
