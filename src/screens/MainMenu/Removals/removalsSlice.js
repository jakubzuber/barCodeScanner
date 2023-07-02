import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchRemovals = createAsyncThunk('routes/fetchRemovals', async () => {
    const response = await fetch('http://192.168.0.191:4999/apiFetchRemovals', {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        }
    })
    const data = response.json()
    return data
});

const removalsSlice = createSlice({
    name: 'removals',
    initialState: {
        removals: [],
        loading: false | true,
        error: ''
    },
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(fetchRemovals.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchRemovals.fulfilled, (state, action) => {
            state.removals = action.payload
            state.loading = false
            state.error = ''
        })
        builder.addCase(fetchRemovals.rejected, (state, action) => {
            state.removals = []
            state.loading = false
            state.error = action.error.message
        })
    }
})

export const selectRemovals = state => state.removals

export default removalsSlice.reducer;