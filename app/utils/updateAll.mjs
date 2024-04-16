import { database } from "../database/database.mjs";
import { completeTask } from "../lib/completeTask.mjs";
import { updateTask } from "../lib/updateTask.mjs";

export const updateAll = (e) => {
  console.log("checked type => ", e);
  database.get().value.forEach((element) => {
    // completeTask(element.id);
    updateTask(element.id, true);
  });
  document.querySelectorAll(".toggle").forEach((element) => {
    switch (element.checked) {
      case true:
        element.checked = false;
        if (element.parentNode.parentNode.classList.contains("completed"))
          element.parentNode.parentNode.classList.remove("completed");
        break;
      case false:
        element.checked = true;
        if (!element.parentNode.parentNode.classList.contains("completed"))
          element.parentNode.parentNode.classList.add("completed");
        break;
    }
  });
};
