import { newElement, prependElement } from "../../src/modules/dom.mjs";
import { database } from "../database/database.mjs";
import { genTaskObj } from "../lib/genVirtualObj.mjs";
import { footerObj, toggleAllObj } from "../virtualObj.mjs";

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
    const toggleButton = document.getElementsByClassName(
        "toggle-all-container"
      )[0],
      footer = document.getElementsByClassName("footer")[0];
    if (database.get().value.length == 0) {
      document.getElementsByClassName("main")[0].removeChild(toggleButton);
      document.getElementById("root").removeChild(footer);
      return;
    }
    if (!toggleButton && !footer) {
      prependElement(toggleAllObj, "main", "class");
      newElement(footerObj, "root", "id");
    }
    database.get().value.forEach((item) => {
      if (item.state === "active") {
        const obj = genTaskObj(item.id, item.content, item.state);
        newElement(obj, "todo-list", "class");
      }
    });
  };

  renderAll = () => {
    document.getElementsByClassName("todo-list")[0].innerHTML = "";
    document.querySelectorAll("a").forEach((x) => {
      if (x.href == "#/all" && !x.classList.contains("selected")) {
        x.classList.add("selected");
      } else {
        x.classList.remove("selected");
      }
    });
    const toggleButton = document.getElementsByClassName(
        "toggle-all-container"
      )[0],
      footer = document.getElementsByClassName("footer")[0];
    if (database.get().value.length == 0) {
      if (toggleButton && footer) {
        document.getElementsByClassName("main")[0].removeChild(toggleButton);
        document.getElementById("root").removeChild(footer);
      }
      return;
    }
    if (!toggleButton && !footer) {
      prependElement(toggleAllObj, "main", "class");
      newElement(footerObj, "root", "id");
    }
    database.get()["value"].forEach((item) => {
      const obj = genTaskObj(item.id, item.content, item.state);
      newElement(obj, "todo-list", "class");
    });
  };

  renderDone = () => {
    document.getElementsByClassName("todo-list")[0].innerHTML = "";
    document.querySelectorAll("a").forEach((x) => {
      if (x.href == "#/completed" && !x.classList.contains("selected")) {
        x.classList.add("selected");
      } else {
        x.classList.remove("selected");
      }
    });
    const toggleButton = document.getElementsByClassName(
        "toggle-all-container"
      )[0],
      footer = document.getElementsByClassName("footer")[0];
    if (database.get().value.length == 0) {
      document.getElementsByClassName("main")[0].removeChild(toggleButton);
      document.getElementById("root").removeChild(footer);
      return;
    }
    if (!toggleButton && !footer) {
      prependElement(toggleAllObj, "main", "class");
      newElement(footerObj, "root", "id");
    }
    database.get().value.forEach((item) => {
      if (item.state === "completed") {
        const obj = genTaskObj(item.id, item.content, item.state);
        newElement(obj, "todo-list", "class");
      }
    });
  };
}
