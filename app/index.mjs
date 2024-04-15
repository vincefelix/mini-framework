import { newElement } from "../modules/dom.mjs";
import { hdleEvent } from "../modules/event.mjs";
import { Router } from "../modules/route.mjs";
import { Render } from "./routes/render.mjs";
import { completeAll } from "./utils/completeAll.mjs";
import { create } from "./utils/create.mjs";
import { virtualObj } from "./virtualObj.mjs";

export const main = (props) => {
  const render = new Render(),
    routes = new Router({
      "/all": render.renderAll,
      "/active": render.renderActive,
      "/completed": render.renderDone,
    });

  newElement(props);
  hdleEvent("click", document.getElementsByClassName("display-all")[0], () => {
    history.pushState({}, "", "http://127.0.0.1:5500/public/index.html/all");
    routes.loadCurrentView();
  });

  hdleEvent(
    "click",
    document.getElementsByClassName("display-active")[0],
    () => {
      history.pushState(
        {},
        "",
        "http://127.0.0.1:5500/public/index.html/active"
      );
      routes.loadCurrentView();
    }
  );

  hdleEvent("click", document.getElementsByClassName("display-done")[0], () => {
    history.pushState(
      {},
      "",
      "http://127.0.0.1:5500/public/index.html/completed"
    );
    routes.loadCurrentView();
  });

  hdleEvent("click", document.getElementById("add-todo"), () => {
    create();
    routes.loadCurrentView();
  });

  hdleEvent("click", document.getElementById("add-todo"), () => {
    create();
    routes.loadCurrentView();
  });

  hdleEvent("click", document.getElementById("validate-all"), () => {
    completeAll();
    routes.loadCurrentView();
  });

  routes.loadCurrentView();
};

main(virtualObj);
