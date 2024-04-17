import { newElement } from "../modules/dom.mjs";
import { hdleEvent } from "../modules/event.mjs";
import { Router } from "../modules/route.mjs";
import { Render } from "./routes/render.mjs";
import { create } from "./utils/create.mjs";
import { itemCount } from "./utils/itemCount.mjs";
import { updateAll } from "./utils/updateAll.mjs";
import { virtualObj } from "./virtualObj.mjs";

export const main = (props) => {
  if (!window.location.href.includes("#"))
    history.pushState({}, "", `${window.location.href}#/all`);
  const render = new Render(),
    routes = new Router({
      "/all": render.renderAll,
      "/active": render.renderActive,
      "/completed": render.renderDone,
    });

  newElement(props);

  document.querySelectorAll("a").forEach((x) => {
    hdleEvent("click", x, () => {
      history.pushState({}, "", x.href);
      routes.loadCurrentView();
    });
  });

  hdleEvent("keypress", document.getElementById("todo-input"), (e) => {
    if (e.key == "Enter") {
      create();
      console.log("✔ task created successfully");
      itemCount();
      routes.loadCurrentView();
    }
  });
  hdleEvent(
    "click",
    document.getElementsByClassName("toggle-all-container")[0],
    () => {
      updateAll();
      itemCount();
      routes.loadCurrentView();
    }
  );

  routes.loadCurrentView();
};
main(virtualObj);
