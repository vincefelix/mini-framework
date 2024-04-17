import { updateTask } from "../lib/updateTask.mjs";
import { itemCount } from "./itemCount.mjs";

export const update = (e) => {
  console.log("checked type => ", e);
  const element = e.target;
  console.log("id is here => ", element, " ", element.checked);
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
