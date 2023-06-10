import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchNewOrdersDetails = createAsyncThunk('routes/fetchNewOrdersDetails', async (ID) => {
    const response = await fetch('http://192.168.0.194:4999/apiFetchNewOrdersDetails', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            idOrder: ID
        })
    })
    const data = response.json()
    return data
});

const newOrdersDetailsSlice = createSlice({
    name: 'newOrdersDetails',
    initialState: {
        newOrdersDetails: [],
        loading: false | true,
        error: ''
    },
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(fetchNewOrdersDetails.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchNewOrdersDetails.fulfilled, (state, action) => {
            state.newOrdersDetails = action.payload
            state.loading = false
            state.error = ''
        })
        builder.addCase(fetchNewOrdersDetails.rejected, (state, action) => {
            state.newOrders = []
            state.loading = false
            state.error = action.error.message
        })
    }
})

export const selectNewOrdersDetails = state => state.newOrdersDetails

export default newOrdersDetailsSlice.reducer;