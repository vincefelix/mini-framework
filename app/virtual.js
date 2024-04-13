export const virtualObj = {
  tag: "div",
  attrs: {
    id: "container",
  },
  children: [
    { tag: "h1", attrs: { class: "title" }, children: ["TODOS"] },
    //?-------------------- display input zone ---------------------
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
          //*--------- buttons -----------------
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
                        opacity: 0.8,
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
                }
              ],
            },
            {
              tag: "button",
              attrs: { id: "add-todo", class: "cmd hover-btn" },
              children: [
                {
                  tag: "svg",
                  attrs: {
                    width: "43",
                    height: "35",
                    viewBox: "0 0 43 48",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                  },
                  children: [
                    {
                      tag: "rect",
                      attrs: {
                        width: "7.30115",
                        height: "46.9541",
                        rx: "3.65058",
                        transform:
                          "matrix(0.999391 0.0348995 0.00855318 -1.00002 17.9391 47.308)",
                        fill: "white",
                        xmlns: "http://www.w3.org/2000/svg",
                      },
                    },
                    {
                      tag: "rect",
                      attrs: {
                        width: "8.29571",
                        height: "41.3323",
                        rx: "4.14785",
                        transform:
                          "matrix(-0.0174524 -0.999848 -0.99996 -0.0152587 42.1935 28.8464)",
                        fill: "white",
                        xmlns: "http://www.w3.org/2000/svg",
                      },
                    },
                  ],
                },
              ],
            },
          ],
          //*--------- end of buttons -----------------
        },
      ],
    },
    //?-------------------- end of display input zone ---------------------
    //********************************************************************/
    //?-------------------- display tasks ---------------------
    { tag: "div", attrs: { class: "middle" } },
    //?------------------- footer side ------------------------
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
          tag: "div",
          attrs: { id: "events" },
          children: [
            {
              tag: "span",
              attrs: { class: "display-all footer  hover-link" },
              children: ["All"],
            },
            {
              tag: "span",
              attrs: { class: "display-active footer hover-link" },
              children: ["Active"],
            },
            {
              tag: "span",
              attrs: { class: "display-done footer hover-link" },
              children: ["Done"],
            },
          ],
        },
        {
          tag: "span",
          attrs: { class: "hover-link", id: "clear-footer" },
          children: ["Clear Completed"],
        },
      ],
    },
    //?------------------- end of footer side ------------------------
    //********************************************************************/
    //?------------ credits ---------------
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
    //?------------ end of credits ---------------
    //********************************************************************/
  ],
};
