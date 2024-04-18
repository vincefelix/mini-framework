import { database } from "../database/database.mjs";
import { updateTask } from "../lib/updateTask.mjs";

export const updateAll = () => {
  updateTask(0, true);
  console.log(database.get().value);
};
