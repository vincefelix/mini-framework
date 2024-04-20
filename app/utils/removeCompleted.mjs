import { routes } from "../main.mjs";
import { removeTask } from "../lib/removeTask.mjs";

export function removeCompleted(e) {
  document.querySelectorAll("li").forEach((el) => {
    if (el.classList.contains("completed"))
      removeTask(el.children[0].children[2].id);
  });
  e.target.disabled = true;
  routes.loadCurrentView();
}
