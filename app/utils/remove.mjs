import { routes } from "../index.mjs";
import { removeTask } from "../lib/removeTask.mjs";
import { itemCount } from "./itemCount.mjs";

export function remove(e) {
  console.log("here=> ", e.target.id);
  removeTask(e.target.id);
  itemCount();
  routes.loadCurrentView();
}
