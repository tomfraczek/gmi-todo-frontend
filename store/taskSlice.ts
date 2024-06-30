// src/slices/taskSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  Task,
} from "../helpers/api";

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

// Async thunk to fetch tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await getAllTasks();
  return response;
});

// Async thunk to fetch a single task
export const fetchTask = createAsyncThunk(
  "tasks/fetchTask",
  async (id: number) => {
    const response = await getTask(id);
    return response;
  }
);

// Async thunk to create a new task
export const createNewTask = createAsyncThunk(
  "tasks/createTask",
  async (task: Partial<Task>) => {
    const response = await createTask(task);
    return response;
  }
);

// Async thunk to update a task
export const updateTaskThunk = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updateData }: { id: number; updateData: Partial<Task> }) => {
    const response = await updateTask(id, updateData);
    return response;
  }
);

// Async thunk to delete a task
export const deleteTaskThunk = createAsyncThunk(
  "tasks/deleteTask",
  async (id: number) => {
    await deleteTask(id);
    return id;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(fetchTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch task";
      })
      .addCase(createNewTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        if (state.currentTask && state.currentTask.id === updatedTask.id) {
          state.currentTask = updatedTask;
        }
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        if (state.currentTask && state.currentTask.id === action.payload) {
          state.currentTask = null;
        }
      });
  },
});

export default taskSlice.reducer;
