import {database } from "../database/database.mjs";

export const updateTask = (id, all = false) => {
  console.log("in update...", all, " ", id);
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
            //  if (currentRoute == "active") removeTask(id, "front")
            console.log("el ", el, " setted completed");
            break;

          case "completed":
            el.state = "active";
            console.log("el ", el, " setted active");
            // if (currentRoute == "completed") removeTask(id, "front")
            break;
        }
      }
    });
    return dataList
  });
};
