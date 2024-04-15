import { dataList } from "../database/database";

export const itemLeft = () => {
  const length = dataList
    .filter((item) => {
      item.state == "active";
    })
    .length();
  document.getElementById("remaining-count").value = length;
};
