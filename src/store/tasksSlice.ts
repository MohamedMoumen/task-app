// src/store/tasksSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from "axios";
import { ITask } from '../interfaces/task.interface';

interface TasksState {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchTasks = createAsyncThunk<ITask[]>('tasks/fetchTasks', async () => {
  const response = await fetch('/api/tasks');
  const data = await response.json();
  return data as ITask[];
});

export const addOrUpdateTask = createAsyncThunk(
  "tasks/addOrUpdateTask",
  async (task: ITask, { rejectWithValue }) => {
    try {
      if (task._id) {
        // Update task if _id exists
        const response = await axios.put(`/api/tasks/${task._id}`, task);
        return response.data;
      } else {
        // Create new task if _id does not exist
        const response = await axios.post('/api/tasks', task);
        return response.data;
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<ITask[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(addOrUpdateTask.fulfilled, (state, action: PayloadAction<ITask>) => {
        const existingTaskIndex = state.tasks.findIndex(task => task._id === action.payload._id);
        if (existingTaskIndex >= 0) {
          // Update task if it exists in the state
          state.tasks[existingTaskIndex] = action.payload;
        } else {
          // Add new task if it's a new task
          state.tasks.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(addOrUpdateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrUpdateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export default tasksSlice.reducer;
