import { database } from "../database/database.mjs";

export const updateTaskValue = (id, content) => {
  database.set((dataList) => {
    //--------------------
    dataList.value.map((el) => {
      if (el.id == id) el.content = content;
    });
    return dataList;
  });
};
