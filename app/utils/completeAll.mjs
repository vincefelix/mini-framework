import { database } from "../database/database.mjs";
import { completeTask } from "../lib/completeTask.mjs";

export const completeAll = () => {
  database.get().forEach((element) => {
    completeTask(element.id);
  });
};
