import { HdleDOM } from "../modules/dom.mjs";
import { virtualObj } from "../app/virtual.js";

const testing = (props) => {
  const tree = new HdleDOM();
  let el = tree.newElement(props);
  console.log("Testing component: ", el);
};

// const tst = {
//   tag: "div",
//   attrs: {
//     class: "nameSubm",
//   },
//   children: [
//     {
//       tag: "input",
//       attrs: {
//         type: "text",
//         placeholder: "Insert Name",
//       },
//     },
//     {
//       tag: "input",
//       attrs: {
//         type: "submit",
//         placeholder: "Submit",
//       },
//     },
//   ],
// };

testing(virtualObj);
