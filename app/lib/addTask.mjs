import {database } from "../database/database.mjs";

export const addTask = (props = {}) => {
  //--------------------
  console.log("adding tasks...", props);
  database.set((x) => {
    x["value"].push(props);
  });
};
