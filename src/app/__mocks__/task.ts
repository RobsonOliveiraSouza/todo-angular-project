import { Task } from '../feature/task/model/task.model';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Ir na academia',
    isCompleted: false,
    categoryId: '5',
    dueDate: '2025-03-18'
  },
  {
    id: '2',
    title: 'Comprar pão na padaria',
    isCompleted: true,
    categoryId: '1',
    dueDate: '2025-03-19'
  },
];

export const task: Task = {
  id: '1',
  title: 'Ir na academia',
  isCompleted: false,
  categoryId: '5',
  dueDate: '2025-03-18'
};

export const TASK_INTERNAL_SERVER_ERROR_RESPONSE: {
  status: number;
  statusText: string;
} = {
  status: 500,
  statusText: 'Internal Server Error',
};

export const TASK_UNPROCESSIBLE_ENTITY_RESPONSE: {
  status: number;
  statusText: string;
} = {
  status: 422,
  statusText: 'Unprocessable Entity',
};

export const TASK_NOT_FOUND_RESPONSE: {
  status: number;
  statusText: string;
} = {
  status: 404,
  statusText: 'Not found',
};