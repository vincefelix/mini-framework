import {database } from "../database/database.mjs";

export const updateTask = (id, all = false) => {
  if (all) {
    database.set((dataList) => {
      //--------------------
      let count = 0;
      //--------------------
      dataList.value.forEach((el) => {
        if (el.state == "completed") count++;
      });
      if (count == dataList.value.length) {
        dataList.value.map((el) => {
          el.state = "active";
        });
      } else {
        dataList.value.map((el) => {
          el.state = "completed";
        });
      }
      return dataList;
    });
    return;
  }

  database.set((dataList) => {
    //--------------------
    dataList.value.map((el) => {
      if (el.id == id) {
        switch (el.state) {
          case "active":
            el.state = "completed";
            break;

          case "completed":
            el.state = "active";
            break;
        }
      }
    });
    return dataList
  });
};
