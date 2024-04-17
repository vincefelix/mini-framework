import { database } from "../database/database.mjs";
import { updateTask } from "../lib/updateTask.mjs";

export const updateAll = () => {
  database.get().value.forEach((element) => {
    updateTask(element.id, true);
  });

  console.log("after update => ", database.get().value);
  document.querySelectorAll(".toggle").forEach((element) => {
    if (!element.checked) {
      element.checked = true;
      if (!element.parentNode.parentNode.classList.contains("completed")) {
        element.parentNode.parentNode.classList.add("completed");
      }
    }
  });
};
