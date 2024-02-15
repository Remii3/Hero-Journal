export type TodoTask = {
  title: string;
  description: string;
  deadline: Date;
  checkList: { id: string; text: string }[];
  status: "done" | "pending";
  difficulty: "easy" | "medium" | "hard";
  userId: string;
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
