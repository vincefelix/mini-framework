import { complete } from "../utils/complete.mjs";
import { remove } from "../utils/remove.mjs";

export const genTaskObj = (content = "", state = "") => {
  state = state == "completed" ? state : "";
  return {
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
              class: "toggle",
              type: "checkbox",
              "data-testid": "todo-item-toggle",
            },
          },
          {
            tag: "label",
            attrs: {
              "data-testid": "todo-item-label",
              contenteditable: true,
            },
            children: [content],
          },
          {
            tag: "button",
            attrs: {
              class: "destroy",
              "data-testid": "todo-item-button",
            },
          },
        ],
      },
    ],
  };
};
