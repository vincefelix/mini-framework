import { hdleEvent } from "../../src/modules/event.mjs";
import { updateTaskValue } from "../lib/updateTaskValue.mjs";
import { routes } from "../main.mjs";

export const edit = (e) => {
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
  e.target.parentNode.parentNode.classList.remove("completed");
  
  hdleEvent("keypress", e.target, (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateTaskValue(siblingInput.id, e.target.textContent);
      edited = true;
      routes.loadCurrentView();
    }
  });

  hdleEvent("blur", e.target, (e) => {
    if (e.target.textContent != initial && !edited) {
      e.target.textContent = initial;
    }
    edited = false;
    routes.loadCurrentView();
  });
};
