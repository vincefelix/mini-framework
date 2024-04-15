import { removeTask } from "../lib/removeTask.mjs";

export function remove() {
  removeTask(this.id.split("-")[1]);
}
