import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch, AppThunk } from "../store";
import axios from "axios";

interface UserinfoInter {
  id?: number;
  username?: string;
  role?: "admin" | "user";
  exp?: number;
  iat?: number;
}

export interface UserinfoState {
  userinfo?: UserinfoInter;
  token?: string;
}

const initialState: UserinfoState = {
  userinfo: undefined,
  token: window.localStorage.getItem("token")
    ? (window.localStorage.getItem("token") as string)
    : undefined,
};

export const verifyTokenAsync = createAsyncThunk(
  "userinfo/verifyToken",
  async () => {
    const res = await axios.get("/users/verify1");
    // The value we return becomes the `fulfilled` action payload
    return res.data;
  }
);

export const userinfoSlice = createSlice({
  name: "userinfo",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder.addCase(verifyTokenAsync.fulfilled, (state, action) => {
      state.userinfo = action.payload;
    });
    builder.addCase(verifyTokenAsync.rejected, (state, action) => {
      console.log("rejected");
      throw Error("token is not authenticated");
    });
  },
});

export const { setToken } = userinfoSlice.actions;
// !!!CAUTION!!! select中state后面要接reducer名，而不是slice名
export const selectUserinfo = (state: RootState) =>
  state.userinfoReducer.userinfo;

export const selectToken = (state: RootState) => state.userinfoReducer.token;

export default userinfoSlice.reducer;