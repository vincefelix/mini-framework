import { hdleEvent } from "../../src/modules/event.mjs";
import { edit } from "../utils/edit.mjs";
import { remove } from "../utils/remove.mjs";
import { update } from "../utils/update.mjs";
import { updateTaskValue } from "./updateTaskValue.mjs";

export const genTaskObj = (id = "", content = "", state = "") => {
  state = state == "completed" ? state : "";
  const obj = {
    tag: "li",
    attrs: {
      class: state,
      "data-testid": "todo-item",
    },
    children: [
      {
        tag: "div",
        attrs: {
          class: "view",
        },
        children: [
          {
            tag: "input",
            attrs: {
              id: id,
              class: "toggle",
              type: "checkbox",
              "data-testid": "todo-item-toggle",
            },
            event: { script: update, type: "change" },
          },
          {
            tag: "label",
            attrs: {
              "data-testid": "todo-item-label",
            },
            //---------- editor
            event: {
              script: edit,
              type: "dblclick",
            },

            children: [content],
          },
          {
            tag: "button",
            attrs: {
              id: id,
              class: "destroy",
              "data-testid": "todo-item-button",
            },
            event: {
              script: remove,
              type: "click",
            },
          },
        ],
      },
    ],
  };
  if (state === "completed") obj.children[0].children[0].attrs.checked = true;
  return obj;
};
