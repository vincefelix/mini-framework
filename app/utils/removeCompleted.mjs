import { routes } from "../main.mjs";
import { database } from "../database/database.mjs";

export function removeCompleted(e) {  
  database.set((x) => {
    x.value = x.value.filter((x) => x.state !== "completed")
    return x
  });
  e.target.disabled = true;
  routes.loadCurrentView();
}
