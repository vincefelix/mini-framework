import { HdleState } from "../../modules/state.mjs";

export const database = new HdleState({
  value: [
    {
      id: 1,
      content: "todo 1",
      state: "active",
    },
    {
      id: 2,
      content: "todo 2",
      state: "completed",
    },
    {
      id: 3,
      content: "todo 3",
      state: "completed",
    },
    {
      id: 4,
      content: "todo 4",
      state: "active",
    },
  ],
});

export const counter = {
  value: 0,
};