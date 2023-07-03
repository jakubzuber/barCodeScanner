import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchRemovalDetails = createAsyncThunk('routes/fetchRemovalDetails', async (ID) => {
    const response = await fetch('http://192.168.0.191:4999/apiFetchRemovalDetails', {
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
        addScan: ({newOrdersDetails}, {payload: itemId}) => {
            const index = newOrdersDetails.findIndex(({ ID }) => ID === itemId)
            newOrdersDetails[index].ZESKANOWANE = newOrdersDetails[index].ZESKANOWANE + 1
            //addScanToDatabase(itemId)
        },
        deductScan: ({newOrdersDetails}, {payload: itemId}) => {
            const index = newOrdersDetails.findIndex(({ ID }) => ID === itemId)
            newOrdersDetails[index].ZESKANOWANE = newOrdersDetails[index].ZESKANOWANE - 1
            //deductScanFromDatabase(itemId)
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

/*
export const { 
    addScan,
    deductScan
} = newOrdersDetailsSlice.actions;
*/

export const selectRemuvalsDetails = state => state.removalDetails

export default remuvalDetailsSlice.reducer;