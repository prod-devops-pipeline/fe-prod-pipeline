import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
    isLogIn: boolean;
}

const initialState: AuthState = {
    isLogIn: false, 
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {   
        setLogin: (state) => {
            state.isLogIn = true;
        },  
        setLogOut: (state) => {
            state.isLogIn = false;
        }
    }
});

export const { setLogin, setLogOut } = authSlice.actions;
export default authSlice.reducer;
 