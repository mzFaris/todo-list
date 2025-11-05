import "./styles.css";
import { addAndEditTodo, render, showAddTodoDialog } from "./dom/Dom";
import * as Storage from "./storage/storage";

document.addEventListener("DOMContentLoaded", () => {
  render(Storage.getTodos());
});

document
  .querySelector("#add-button")
  ?.addEventListener("click", showAddTodoDialog);

document
  .querySelector("#submit-button")
  ?.addEventListener("click", addAndEditTodo);
