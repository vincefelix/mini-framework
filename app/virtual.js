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
                  tag: "img",
                  attrs: {
                    src: "/public/assets/check.svg",
                    alt: "check icon",
                    class: "icon1"
                  }
                }
              ],
            },
            {
              tag: "button",
              attrs: { id: "add-todo", class: "cmd hover-btn" },
              children: [
                {
                  tag: "img",
                  attrs: {
                    src: "/public/assets/cross.svg",
                    alt: "cross icon",
                    class: "icon2"
                  },
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
