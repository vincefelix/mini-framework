import { database } from "../database/database.mjs";
import { completeTask } from "../lib/completeTask.mjs";

export const completeAll = () => {
  database.get().value.forEach((element) => {
    completeTask(element.id);
  });
  document.querySelectorAll(".toggle").forEach((element) => {
    element.checked = true;
    element.parentNode.classList.add("completed");
  });
};
