import { database } from "../database/database.mjs";

export const completeTask = (id) => {
  //--------------------
  database.set((x) =>
    x.value.map((el) => {
      if (el.id == id) el.state = "completed";
    })
  );

};
