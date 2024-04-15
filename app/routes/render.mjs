import { newElement } from "../../modules/dom.mjs";
import { dataList, database } from "../database/database.mjs";
import { genTaskObj } from "../lib/genVirtualObj.mjs";

export class Render {
  constructor() {
    this.container = document.getElementById("middle");
  }

  renderActive = () => {
    document.getElementById("middle").innerHTML = "";
    database.get().value.forEach((item) => {
      if (item.state === "active") {
        const obj = genTaskObj(item.id, item.content, item.state);
        newElement(obj, "middle");
      }
    });
  };

  renderAll = () => {
    document.getElementById("middle").innerHTML = "";
    database.get().value.forEach((item) => {
      const obj = genTaskObj(item.id, item.content, item.state);
      newElement(obj, "middle");
    });
  };

  renderDone = () => {
    document.getElementById("middle").innerHTML = "";
    database.get().value.forEach((item) => {
      if (item.state === "completed") {
        const obj = genTaskObj(item.id, item.content, item.state);
        newElement(obj, "middle");
      }
    });
  };
}
