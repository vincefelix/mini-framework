export const virtualObj = {
  tag: "div",
  attrs: {
    id: "container",
  },
  children: [
    { tag: "h1", attrs: { class: "title" }, children: ["TODOS"] },
    {
      tag: "div",
      attrs: {
        class: "input-zone",
      },
      children: [
        {
          tag: "input",
          attrs: {
            id: "typing-zone",
            type: "text",
            placeholder: "what needs to be done?",
          },
        },
        {
          tag: "div",
          attrs: {
            class: "buttons",
          },
          children: [
            {
              tag: "button",
              attrs: { id: "validate-all", class: "cmd hover-btn" },
              children: [
                {
                  tag: "svg",
                  attrs: {
                    width: "65",
                    height: "50",
                    viewBox: "0 0 65 50",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                  },
                  children: [
                    {
                      tag: "path",
                      attrs: {
                        opacity: "0.8",
                        d: "M20.7727 20.9717L35.8176 39.4032L59.7954 5.67743",
                        stroke: "white",
                        "stroke-width": "12",
                      },
                    },
                    {
                      tag: "path",
                      attrs: {
                        opacity: "0.9",
                        d: "M5.46967 19.3265L20.5146 37.7581L44.4924 4.03226",
                        stroke: "white",
                        "stroke-width": "12",
                      },
                    },
                  ],
                },
              ],
            },
            {
              tag: "button",
              attrs: { id: "add-todo", class: "cmd hover-btn" },
            },
          ],
        },
        //display tasks
        { tag: "div", attrs: { class: "middle" } },
        //footer side
        {
          tag: "div",
          attrs: {
            id: "footer",
          },
          children: [
            {
              tag: "p",
              attrs: { id: "remaining" },
              children: [
                {
                  tag: "span",
                  attrs: { id: "remaining-count" },
                  children: ["0"],
                },
                "items left",
              ],
            },
            {
              tag: "span",
              attrs: { id: "display all footer" },
              children: ["All"],
            },
            {
              tag: "span",
              attrs: { id: "display active footer" },
              children: ["Active"],
            },
            {
              tag: "span",
              attrs: { id: "display done footer" },
              children: ["Done"],
            },
            {
              tag: "span",
              attrs: { id: "clear footer" },
              children: ["Clear Done"],
            },
          ],
        },
        //credits
        {
          tag: "div",
          attrs: { class: "credits" },
          children: [
            {
              tag: "ul",
              attrs: { id: "credit-list" },
              children: [
                {
                  tag: "li",
                  attrs: { class: "instruction" },
                  children: ["Double click to edit"],
                },
                {
                  tag: "li",
                  attrs: { class: "author" },
                  children: ["Created by @mv"],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
