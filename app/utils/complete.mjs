import { completeTask } from "../lib/completeTask.mjs";

export function complete() {
  completeTask(this.id.split("-")[1]);
}
