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
        { tag: "button", attrs: { id: "validate-all" } },
        { tag: "button", attrs: { id: "add-todo" } },
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
            { tag: "span", attrs: { id: "remaining-count" }, children: ["0"] },
            "items left",
          ],
        },
        { tag: "span", attrs: { id: "display all footer" }, children: ["All"] },
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
};
