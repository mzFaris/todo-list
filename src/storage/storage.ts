import * as Todo from "../todo/Todo";

const getTodoListFromStorage = (): Todo.Todo[] | undefined => {
  const todoList = localStorage.getItem("todoList");
  if (!todoList) {
    return;
  }

  return JSON.parse(todoList).map((todo: any) => {
    const newTodo = Todo.createTodo({
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
    });
    return Todo.setIdAndChecklist(newTodo, todo.id, todo.checklist);
  });
};

let todoList: Todo.Todo[] = getTodoListFromStorage() || [];

export const getTodos = () => {
  return todoList;
};

export const setTodos = (todos: Todo.Todo[]) => {
  todoList = todos;
  localStorage.setItem("todoList", JSON.stringify(todoList));
};
