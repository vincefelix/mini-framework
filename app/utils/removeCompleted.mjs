import { routes } from "../index.mjs";
import { removeTask } from "../lib/removeTask.mjs";

export function removeCompleted() {
  document.querySelectorAll("li").forEach((el) => {
    if (el.classList.contains("completed"))
      removeTask(el.children[0].children[2].id);
  });
  routes.loadCurrentView();
}
