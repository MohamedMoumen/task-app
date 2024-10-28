import { IUser } from "@/interfaces/user.interface";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    users: IUser[];
    loading: boolean;
    error: string | null;
}
const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
  };

export const fetchUsers = createAsyncThunk<IUser[]>('users/fetchUsers', async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data as IUser[];
});

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<IUser[]>) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch tasks';
        })
    },
});
export default userSlice.reducer;