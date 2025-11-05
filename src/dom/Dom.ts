import * as Storage from "../storage/storage";
import * as Todo from "../todo/Todo";

export const showAddTodoDialog = (e: Event) => {
  setFormModeToAdd();
  showTodoDialog();
};

const editTodo = (e: any) => {
  const todoId = e.target?.getAttribute("data-id");
  const todo = Todo.findTodo(Storage.getTodos(), todoId);
  if (!todo) {
    return;
  }

  closeTodoDetail();
  setEditTodoForm(todo);
  setFormModeToEdit(todoId);
  showTodoDialog();
};

const setFormModeToAdd = () => {
  (document.querySelector("#todo-dialog") as HTMLDialogElement).setAttribute(
    "data-mode",
    "add",
  );
};

const setFormModeToEdit = (todoId: string) => {
  const todoDialog = document.querySelector(
    "#todo-dialog",
  ) as HTMLDialogElement;
  todoDialog.setAttribute("data-mode", "edit");
  todoDialog.setAttribute("data-id", todoId);
};

const showTodoDialog = () => {
  (document.querySelector("#todo-dialog") as HTMLDialogElement).showModal();
};

const setEditTodoForm = (todo: Todo.Todo) => {
  const title = document.querySelector("#title") as HTMLInputElement;
  const description = document.querySelector(
    "#description",
  ) as HTMLInputElement;
  const dueDate = document.querySelector("#due-date") as HTMLInputElement;
  const priority = document.querySelector("#priority") as HTMLInputElement;
  const note = document.querySelector("#note") as HTMLInputElement;
  const todoId = document
    .querySelector("#todo-dialog")
    ?.getAttribute("data-id");

  title.value = todo.title;
  description.value = todo.description;
  dueDate.value = todo.dueDate
    ? `${todo.dueDate.getFullYear()}-${todo.dueDate.getMonth()}-${todo.dueDate.getDate()}`
    : "";
  priority.value = String(todo.priority);
  note.value = todo.note;
};

export const addAndEditTodo = (e: Event) => {
  const title = document.querySelector("#title") as HTMLInputElement;
  const description = document.querySelector(
    "#description",
  ) as HTMLInputElement;
  const dueDate = document.querySelector("#due-date") as HTMLInputElement;
  const priority = document.querySelector("#priority") as HTMLInputElement;
  const note = document.querySelector("#note") as HTMLInputElement;
  if (!title?.value) {
    return;
  }

  const newTodo = Todo.createTodo({
    title: title.value,
    description: description.value,
    dueDate: dueDate.value ? new Date(dueDate.value) : null,
    priority: Number(priority.value),
    note: note.value,
  });

  const todoDialog = document.querySelector(
    "#todo-dialog",
  ) as HTMLDialogElement;
  const mode = todoDialog.getAttribute("data-mode");

  const todoList = Storage.getTodos();
  if (mode === "add") {
    Storage.setTodos(Todo.addTodo(todoList, newTodo));
  } else {
    const todoId = todoDialog.getAttribute("data-id");
    if (!todoId) {
      return;
    }

    const todo = Todo.findTodo(todoList, todoId);
    if (!todo) {
      return;
    }

    Storage.setTodos(
      todoList.toSpliced(todoList.indexOf(todo), 1, {
        ...newTodo,
        id: todo.id,
        checklist: todo.checklist,
      }),
    );
  }

  render(Storage.getTodos());
};

export const render = (todoList: Todo.Todo[]) => {
  const content = document.querySelector("#content");
  if (content?.innerHTML) {
    content.innerHTML = "";
  }
  todoList.forEach((todo) => {
    content?.appendChild(createTodo(todo));
  });
};

const createTodo = (todo: Todo.Todo) => {
  const div = document.createElement("div");
  div.classList.add("todo");

  const title = document.createElement("p");
  const dueDate = document.createElement("p");
  const checklist = document.createElement("p");
  const toggleChecklistButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const detailButton = document.createElement("button");

  title.innerText = todo.title;
  dueDate.innerText = todo.dueDate
    ? todo.dueDate.toDateString()
    : "No due date";
  checklist.innerText = todo.checklist ? "Completed" : "Not Completed";

  toggleChecklistButton.innerText = todo.checklist ? "❌" : "✔️";
  toggleChecklistButton.classList.add("todo-button");
  toggleChecklistButton.setAttribute("data-id", todo.id);
  toggleChecklistButton.addEventListener("click", toggleChecklist);

  deleteButton.innerText = "🗑️";
  deleteButton.classList.add("todo-button");
  deleteButton.setAttribute("data-id", todo.id);
  deleteButton.addEventListener("click", deleteTodo);

  detailButton.innerText = "ℹ️";
  detailButton.setAttribute("data-id", todo.id);
  detailButton.addEventListener("click", detailTodo);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  buttonContainer.append(toggleChecklistButton, deleteButton, detailButton);

  const checklistDiv = document.createElement("div");
  checklistDiv.append(checklist, buttonContainer);

  div.append(title, dueDate, checklistDiv);
  return div;
};

const toggleChecklist = (e: any) => {
  const todoList = Storage.getTodos();

  const todoId = e.target?.getAttribute("data-id");
  const todo = Todo.findTodo(todoList, todoId);
  if (!todo) {
    return;
  }

  Storage.setTodos(
    todoList.toSpliced(todoList.indexOf(todo), 1, Todo.toggleChecklist(todo)),
  );

  render(Storage.getTodos());
};

const deleteTodo = (e: any) => {
  const todoId = e.target?.getAttribute("data-id");
  Storage.setTodos(Todo.deleteTodo(Storage.getTodos(), todoId));
  render(Storage.getTodos());
};

const detailTodo = (e: any) => {
  const todoId = e.target?.getAttribute("data-id");
  const todo = Todo.findTodo(Storage.getTodos(), todoId);
  if (!todo) {
    return;
  }

  createTodoDetail(todo);
  (document.querySelector("#todo-detail") as HTMLDialogElement).showModal();
};

const createTodoDetail = (todo: Todo.Todo) => {
  const todoDetail = document.querySelector(
    "#todo-detail",
  ) as HTMLDialogElement;
  if (todoDetail) {
    todoDetail.innerHTML = "";
  }

  const id = document.createElement("p");
  const title = document.createElement("p");
  const description = document.createElement("p");
  const dueDate = document.createElement("p");
  const priority = document.createElement("p");
  const note = document.createElement("p");
  const checklist = document.createElement("p");
  const editButton = document.createElement("button");

  const todoDom = formatToDomType(todo);

  title.innerText = "Title: " + todoDom.title;
  description.innerText = todoDom.description
    ? "Description: " + todoDom.description
    : "";
  dueDate.innerText = todoDom.dueDate;
  priority.innerText = "Priority: ";

  switch (todoDom.priority) {
    case "1":
      priority.innerText += "Low";
      break;
    case "2":
      priority.innerText += "Medium";
      break;
    case "3":
      priority.innerText += "High";
      break;
  }

  note.innerText = todoDom.note ? "Note: " + todoDom.note : "";

  editButton.innerText = "🖊️";
  editButton.setAttribute("data-id", todo.id);
  editButton.addEventListener("click", editTodo);

  todoDetail.append(
    id,
    title,
    description,
    dueDate,
    priority,
    note,
    checklist,
    editButton,
  );
};

const formatToDomType = (todo: Todo.Todo) => {
  return {
    title: todo.title,
    description: todo.description,
    dueDate: todo.dueDate ? todo.dueDate.toDateString() : "No due date",
    priority: String(todo.priority),
    note: todo.note,
  };
};

const closeTodoDetail = () => {
  (document.querySelector("#todo-detail") as HTMLDialogElement).close();
};
