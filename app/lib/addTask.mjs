import { database } from "../database/database.mjs";

export const addTask = (props = {}) => {
  //--------------------
  database.set((x) => {
    x["value"].push(props);
    return x;
  });
};
