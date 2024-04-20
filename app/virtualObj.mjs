import { update } from "./utils/update.mjs";
import { removeCompleted } from "./utils/removeCompleted.mjs";
import { routes } from "./main.mjs";
import { updateAll } from "./utils/updateAll.mjs";
import { itemCount } from "./utils/itemCount.mjs";

export const virtualObj = {
    tag: "section",
    attrs: {
      class: "todoapp",
      id: "root",
    },
    children: [
      {
        tag: "header",
        attrs: {
          class: "header",
          "data-testid": "header",
        },
        children: [
          {
            tag: "h1",
            children: ["todos"],
          },
          {
            tag: "div",
            attrs: {
              class: "input-container",
            },
            children: [
              {
                tag: "input",
                attrs: {
                  class: "new-todo",
                  id: "todo-input",
                  type: "text",
                  "data-testid": "text-input",
                  placeholder: "What needs to be done?",
                  value: "",
                },
              },
              {
                tag: "label",
                attrs: {
                  class: "visually-hidden",
                  for: "todo-input",
                },
                children: ["New Todo Input"],
              },
            ],
          },
        ],
      },
      {
        tag: "main",
        attrs: {
          class: "main",
          "data-testid": "main",
        },
        children: [
          {
            tag: "ul",
            attrs: {
              class: "todo-list",
              "data-testid": "todo-list",
            },
            children: [
              {
                tag: "li",
                attrs: {
                  class: "",
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
                        event: { script: update, type: "checked" },
                      },
                      {
                        tag: "label",
                        attrs: {
                          "data-testid": "todo-item-label",
                          contenteditable: true,
                        },
                        children: ["sdsd"],
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
              },
              {
                tag: "li",
                attrs: {
                  class: "",
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
                        },
                        children: ["sd"],
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
              },
            ],
          },
        ],
      },
    ],
  },
  toggleAllObj = {
    tag: "div",
    attrs: {
      class: "toggle-all-container",
    },
    event: {
      script: () => {
        updateAll();
        itemCount();
        routes.loadCurrentView();
      },
      type: "click",
    },
    children: [
      {
        tag: "input",
        attrs: {
          class: "toggle-all",
          type: "checkbox",
          "data-testid": "toggle-all",
        },
      },
      {
        tag: "label",
        attrs: {
          class: "toggle-all-label",
          for: "toggle-all",
        },

        children: ["Toggle All Input"],
      },
    ],
  },
  footerObj = {
    tag: "footer",
    attrs: {
      class: "footer",
      "data-testid": "footer",
    },
    children: [
      {
        tag: "span",
        attrs: {
          class: "todo-count",
        },
        children: ["1 items left!"],
      },
      {
        tag: "ul",
        attrs: {
          class: "filters",
          "data-testid": "footer-navigation",
        },
        children: [
          {
            tag: "li",
            children: [
              {
                tag: "a",
                attrs: {
                  class: "selected",
                  href: "#/all",
                },
                event: {
                  script: () => {
                    history.pushState({}, "", "#/all");
                    routes.loadCurrentView();
                  },
                  type: "click",
                },
                children: ["All"],
              },
            ],
          },
          {
            tag: "li",
            children: [
              {
                tag: "a",
                attrs: {
                  class: "",
                  href: "#/active",
                },
                event: {
                  script: () => {
                    history.pushState({}, "", "#/active");
                    routes.loadCurrentView();
                  },
                  type: "click",
                },
                children: ["Active"],
              },
            ],
          },
          {
            tag: "li",
            children: [
              {
                tag: "a",
                attrs: {
                  class: "",
                  href: "#/completed",
                },
                event: {
                  script: () => {
                    history.pushState({}, "", "#/completed");
                    routes.loadCurrentView();
                  },
                  type: "click",
                },
                children: ["Completed"],
              },
            ],
          },
        ],
      },
      {
        tag: "button",
        attrs: {
          class: "clear-completed",
          disabled: true,
        },
        event: { script: removeCompleted, type: "click" },
        children: ["Clear completed"],
      },
    ],
  };
