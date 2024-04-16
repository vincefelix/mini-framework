import { newElement } from "../../modules/dom.mjs";
import { database } from "../database/database.mjs";
import { genTaskObj } from "../lib/genVirtualObj.mjs";

export class Render {
  constructor() {
    this.container = document.getElementById("middle");
  }

  renderActive = () => {
    document.getElementsByClassName("todo-list")[0].innerHTML = "";
    document.querySelectorAll("a").forEach((x) => {
      if (x.href == "#/active" && !x.classList.contains("selected")) {
        x.classList.add("selected");
      } else {
        x.classList.remove("selected");
      }
    });
    database.get().value.forEach((item) => {
      if (item.state === "active") {
        const obj = genTaskObj(item.id, item.content, item.state);
        newElement(obj, "todo-list", "class");
      }
    });
  };

  renderAll = () => {
    document.getElementsByClassName("todo-list")[0].innerHTML = "";
    console.log("gotten db => ", database.state);
    database.get()["value"].forEach((item) => {
      const obj = genTaskObj(item.id, item.content, item.state);
      newElement(obj, "todo-list", "class");
      document.querySelectorAll("a").forEach((x) => {
        if (x.href == "#/all" && !x.classList.contains("selected")) {
          x.classList.add("selected");
        } else {
          x.classList.remove("selected");
        }
      });
    });
  };

  renderDone = () => {
    document.getElementsByClassName("todo-list")[0].innerHTML = "";
    database.get().value.forEach((item) => {
      if (item.state === "completed") {
        const obj = genTaskObj(item.id, item.content, item.state);
        newElement(obj, "todo-list", "class");
      }
    });
    document.querySelectorAll("a").forEach((x) => {
      if (x.href == "#/completed" && !x.classList.contains("selected")) {
        x.classList.add("selected");
      } else {
        x.classList.remove("selected");
      }
    });
  };
}
