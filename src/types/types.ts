import { Timestamp } from 'firebase/firestore';

export type TodoTask = {
  title: string;
  description: string;
  deadline: Date | Timestamp;
  checkList: { id: string; text: string }[];
  status: 'done' | 'pending';
  difficulty: 'easy' | 'medium' | 'hard';
  userId: string;
  createdAt: Date | Timestamp;
};

export type DailyTask = {
  title: string;
  description: string;
  status: 'done' | 'pending';
  difficulty: 'easy' | 'medium' | 'hard';
  userId: string;
  finishTime: Date | Timestamp | null;
  createdAt: Date | Timestamp;
};

export type User = {
  uid: string;
  email: string;
  todos: {
    done: {
      quantity: {
        easy: number;
        medium: number;
        hard: number;
      };
      tasks: TodoTask[];
    };
    pending: {
      quantity: {
        easy: number;
        medium: number;
        hard: number;
      };
      tasks: TodoTask[];
    };
  };
};
