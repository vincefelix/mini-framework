import { dataList, database } from "../database/database.mjs";

export const updateTask = (id) => {
  database.set((dataList) => {
    //--------------------
    dataList.value.map((el) => {
      if (el.id == id) {
        switch (el.state) {
          case "active":
            el.state = "completed";
            //  if (currentRoute == "active") removeTask(id, "front")
            break;

          case "completed":
            el.state = "active";
            // if (currentRoute == "completed") removeTask(id, "front")
            break;
        }
      }
    });
  });
};
