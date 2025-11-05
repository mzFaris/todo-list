import { nanoid } from "nanoid";

interface TodoConstructor {
  title: string;
  description: string;
  dueDate: Date | null;
  priority: number;
  note: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: number;
  note: string;
  checklist: boolean;
}

export const createTodo = (todo: TodoConstructor): Todo => {
  return {
    ...todo,
    id: nanoid(),
    checklist: false,
  };
};

export const setIdAndChecklist = (
  todo: Todo,
  id: string,
  checklist: boolean,
): Todo => {
  return {
    ...todo,
    id,
    checklist,
  };
};

export const toggleChecklist = (todo: Todo): Todo => {
  return {
    ...todo,
    checklist: !todo.checklist,
  };
};

export const changePriority = (todo: Todo, priority: number): Todo => {
  return {
    ...todo,
    priority,
  };
};

export const editTodo = (todo: Todo, newTodo: TodoConstructor): Todo => {
  return {
    ...todo,
    ...newTodo,
  };
};

export const addTodo = (todos: Todo[], todo: Todo): Todo[] => {
  return [...todos, todo];
};

export const deleteTodo = (todos: Todo[], todoId: string): Todo[] => {
  return todos.filter((todo) => todo.id !== todoId);
};

export const findTodo = (todos: Todo[], todoId: string): Todo | undefined => {
  return todos.find((todo) => todo.id === todoId);
};
