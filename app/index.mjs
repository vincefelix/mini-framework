import { newElement } from "../modules/dom.mjs";
import { hdleEvent } from "../modules/event.mjs";
import { Router } from "../modules/route.mjs";
import { Render } from "./routes/render.mjs";
import { virtualObj } from "./virtualObj.mjs";

export const main = (props) => {
  console.log("test => ", window.location.pathname);
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
    console.log("in => ", x);
    hdleEvent("click", x, () => {
      history.pushState({}, "", x.href);
      routes.loadCurrentView();
    });
  });

  // hdleEvent("click", document.getElementById("add-todo"), () => {
  //   create();
  //   routes.loadCurrentView();
  // });

  // hdleEvent("click", document.getElementById("validate-all"), () => {
  //   completeAll();
  //   routes.loadCurrentView();
  // });

  routes.loadCurrentView();
};
main(virtualObj);
