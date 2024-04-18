import { updateTask } from "../lib/updateTask.mjs";
import { itemCount } from "./itemCount.mjs";

export const update = (e) => {
  const element = e.target;
  updateTask(element.id);

  if (!element.checked) {
    if (element.parentNode.parentNode.classList.contains("completed"))
      element.parentNode.parentNode.classList.remove("completed");
  } else {
    if (!element.parentNode.parentNode.classList.contains("completed"))
      element.parentNode.parentNode.classList.add("completed");
  }
  
  itemCount();
};
