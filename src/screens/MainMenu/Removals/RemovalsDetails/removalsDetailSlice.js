import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addToDatabase } from "../callsToDatabase";

export const fetchRemovalDetails = createAsyncThunk('routes/fetchRemovalDetails', async (ID) => {
    const response = await fetch('http://10.0.0.153:4999/apiFetchRemovalDetails', {
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

const remuvalDetailsSlice = createSlice({
    name: 'removalDetails',
    initialState: {
        relesesDetails: [],
        loading: false | true,
        error: ''
    },
    reducers: {
        addScan: ({removalDetails}, {payload: itemId}) => {
            const index = removalDetails.findIndex(({ ID }) => ID === itemId)
            removalDetails[index].ZESKANOWANE = removalDetails[index].ZESKANOWANE + 1
            addToDatabase(itemId)
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchRemovalDetails.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchRemovalDetails.fulfilled, (state, action) => {
            state.removalDetails = action.payload
            state.loading = false
            state.error = ''
        })
        builder.addCase(fetchRemovalDetails.rejected, (state, action) => {
            state.removalDetails = []
            state.loading = false
            state.error = action.error.message
        })
    }
})


export const { 
    addScan
} = remuvalDetailsSlice.actions;


export const selectRemuvalsDetails = state => state.removalDetails

export default remuvalDetailsSlice.reducer;