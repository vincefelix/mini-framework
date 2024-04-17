import {database } from "../database/database.mjs";

export const updateTask = (id, all = false) => {
  if (all) {
    database.set((dataList) => {
      //--------------------
      dataList.value.map((el) => {
        if (el.id == id) el.state = "completed";
      });
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
            console.log("el ", el, " setted completed");
            break;

          case "completed":
            el.state = "active";
            console.log("el ", el, " setted active");
            break;
        }
      }
    });
    return dataList
  });
};
