import { removeTask } from "../lib/removeTask.mjs";

export function remove(e) {
  console.log("here=> ", e.target.id);
  removeTask(e.target.id);
  document
    .getElementsByClassName("todo-list")[0]
    .removeChild(document.getElementById(e.target.id).parentNode.parentNode);
}
