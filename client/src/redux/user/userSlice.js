import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        setUser : (state,action) => {
            state.currentUser = action.payload
        }
    }
})

export const {setUser} = userSlice.actions

export default userSlice.reducer