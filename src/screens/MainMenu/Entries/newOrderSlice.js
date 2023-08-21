import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ip } from "../../../ipconfig";

export const fetchNewOrders = createAsyncThunk('routes/fetchNewOrders', async () => {
    const response = await fetch(`http://${ip}:4999/apiFetchNewOrders`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        }
    })
    const data = response.json()
    return data
});

const newOrdersSlice = createSlice({
    name: 'newOrders',
    initialState: {
        newOrders: [],
        loading: false | true,
        error: ''
    },
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(fetchNewOrders.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchNewOrders.fulfilled, (state, action) => {
            state.newOrders = action.payload
            state.loading = false
            state.error = ''
        })
        builder.addCase(fetchNewOrders.rejected, (state, action) => {
            state.newOrders = []
            state.loading = false
            state.error = action.error.message
        })
    }
})

export const selectNewOrders = state => state.newOrders

export default newOrdersSlice.reducer;