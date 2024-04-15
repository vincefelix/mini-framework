import { counter } from "../database/database.mjs";
import { addTask } from "../lib/addTask.mjs";

export const create = () => {
  counter.value++;
  const inputZone = document.getElementById("typing-zone"),
    props = {
      id: counter.value,
      content: inputZone.value.trim(),
      state: "active",
    };
  addTask(props);
};
