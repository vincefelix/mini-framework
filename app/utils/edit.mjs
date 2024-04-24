import { hdleEvent } from "../../src/modules/event.mjs";
import { updateTaskValue } from "../lib/updateTaskValue.mjs";

export const edit = (e) => {
  let test = e.target.style.textDecoration
  let testColor = e.target.style.color
  let edited = false;
  let initial = e.target.textContent;
  e.target.contentEditable = true;
  let siblingInput = e.target.previousSibling;
  siblingInput.parentNode.removeChild(siblingInput);


  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
  e.target.focus();
  e.target.style.textDecoration = "none";
  e.target.style.color = "#484848"
  hdleEvent("keypress", e.target, (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateTaskValue(siblingInput.id, e.target.textContent);
      edited = true;
      e.target.contentEditable = false;
      e.target.style.textDecoration = test

      let newSiblingInput = document.createElement("input");
      newSiblingInput.type = "checkbox";
      newSiblingInput.id = siblingInput.id;
      newSiblingInput.checked = siblingInput.checked;
      newSiblingInput.dataset.testid = "todo-item-toggle";
      newSiblingInput.classList.add("toggle");
      e.target.parentNode.insertBefore(newSiblingInput, e.target);
      e.target.style.color = testColor
    }
  });

  hdleEvent("blur", e.target, (e) => {
    // console.log('siblings est la',e.target.previousSibling);
    if (e.target.textContent != initial && !edited) {
      e.target.textContent = initial;
    }
    edited = false;
    e.target.contentEditable = false;
  });
};
