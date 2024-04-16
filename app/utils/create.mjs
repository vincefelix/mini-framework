import { counter } from "../database/database.mjs";
import { addTask } from "../lib/addTask.mjs";

export const create = () => {
  counter.value++;
  const inputZone = document.getElementById("typing-zone");
  if (inputZone.value.trim().length > 1) {
    const props = {
      id: counter.value,
      content: inputZone.value.trim(),
      state: "active",
    };
    inputZone.value = "";
    addTask(props);
  } else {
    console.error("task must have at least 2 chars");
  }
};
