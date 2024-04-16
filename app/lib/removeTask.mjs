import { database } from "../database/database.mjs";

export const removeTask = (id, place) => {
  //--------------------
  if (place != "front")
    database.set((dataList) => {
      dataList.value.splice(
        dataList.value.findIndex((el) => el["id"] == id),
        1
      );
      return dataList;
    });
  console.log("after del => ", database.get());
};
