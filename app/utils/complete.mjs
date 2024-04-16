import { completeTask } from "../lib/completeTask.mjs";

export function complete() {
  console.log("clicked id => ", this);
  completeTask(this.id.split("-")[1]);
}
