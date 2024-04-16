import { database } from "../database/database.mjs";

export const addTask = (props = {}) => {
  //--------------------
  console.log("adding tasks...", props);
  database.set((x) => {
    console.log("poor ", x);
    x["value"].push(props);
    console.log("added in db successfully");
    return x;
  });
};
