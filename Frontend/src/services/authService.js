
import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signupUser = (data) =>
  authApi.post("/signup", data);

export const loginUser = (data) =>
  authApi.post("/login", data);

export const getMe = () =>
  authApi.get("/me");

export const logoutUser = () =>
  authApi.post("/logout");
