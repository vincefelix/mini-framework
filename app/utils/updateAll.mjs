import { database } from "../database/database.mjs";
import { completeTask } from "../lib/completeTask.mjs";
import { updateTask } from "../lib/updateTask.mjs";

export const updateAll = () => {
  //  console.log("checked type => ", e);
  database.get().value.forEach((element) => {
    // completeTask(element.id);
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
