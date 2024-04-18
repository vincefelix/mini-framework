import { hdleEvent } from "../../src/modules/event.mjs";
import { updateTaskValue } from "../lib/updateTaskValue.mjs";

export const edit = (e) => {
  let edited = false;
  let initial = e.target.textContent;
  e.target.contentEditable = true;
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
  e.target.focus();
  hdleEvent("keypress", e.target, (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateTaskValue(e.target.previousSibling.id, e.target.textContent);
      edited = true;
      e.target.contentEditable = false;
    }
  });

  hdleEvent("blur", e.target, (e) => {
    if (e.target.textContent != initial && !edited) {
      e.target.textContent = initial;
    }
    edited = false;
    e.target.contentEditable = false;
  });
};
