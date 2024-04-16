import { removeTask } from "../lib/removeTask.mjs";

export function removeCompleted() {
  document.querySelectorAll("li").forEach((el) => {
    if (el.classList.contains("completed")) {
      el.parentNode.removeChild(el);
      console.log("found id to remove => ", el.children[0].children[2].id);
      removeTask(el.children[0].children[2].id);
    }
  });
}
