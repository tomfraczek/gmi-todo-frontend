// src/slices/taskSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  Task,
} from "../helpers/api";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Async thunk to fetch tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await getAllTasks();
  return response;
});

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
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
