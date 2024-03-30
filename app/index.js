//import { hdleDOM } from "../modules/dom.mjs";

const testing = (props) => {
  const tree = new hdleDOM();
  let el = tree.newElement(props);
  console.log("Testing component: ", el);
};

const tst = {
  tag: "div",
  attrs: {
    class: "nameSubm",
  },
  children: [
    {
      tag: "input",
      attrs: {
        type: "text",
        placeholder: "Insert Name",
      },
    },
    {
      tag: "input",
      attrs: {
        type: "submit",
        placeholder: "Submit",
      },
    },
  ],
};

testing(tst);
