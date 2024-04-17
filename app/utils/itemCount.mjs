import { database } from "../database/database.mjs";

export const itemCount = () => {
  var itemNbr = database.get().value.filter((x) => x.state === "active").length,
    itemDisplay = document.getElementsByClassName("todo-count")[0];
  if (itemDisplay)
    itemDisplay.textContent = `${itemNbr} item${itemNbr > 1 ? "s" : ""} left!`;
};
