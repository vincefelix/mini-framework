import { complete } from "../utils/complete.mjs";
import { remove } from "../utils/remove.mjs";

export const genTaskObj = (id = 0, content = "", state = "active") => {
  state += "-task";
  return {
    tag: "div",
    attrs: {
      id: `task${id}`,
      class: `task ${state} hover-task`,
    },
    children: [
      {
        tag: "label",
        attrs: {
          contenteditable: "true",
          class: "focus-label",
        },
        children: [content],
      },
      {
        tag: "div",
        attrs: {
          class: "buttons btn-task",
        },
        children: [
          {
            tag: "button",
            attrs: {
              id: `check-${id}`,
              class: "btn validate hover-btn",
            },
           event: { script: complete, type: "click" },
            children: [
              {
                tag: "img",
                attrs: {
                  class: "icon2",
                  src: "/public/assets/validate.svg",
                  alt: "validate icon",
                },
              },
            ],
          },
          {
            tag: "button",
            attrs: {
              id: `del-${id}`,
              class: "btn delete hover-btn",
            },
            event: { script: remove, type: "click" },
            children: [
              {
                tag: "img",
                attrs: {
                  class: "icon1",
                  src: "/public/assets/cross.svg",
                  alt: "cross icon",
                },
              },
            ],
          },
        ],
      },
    ],
  };
};
