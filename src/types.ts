export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};

export type Workspace = {
  id: Id;
  name: string;
  columns: Column[];
};

export type Event = {
  id: Id;
  name: string;
  startDate: string;
  endDate: string;
  observation?: string;
};
