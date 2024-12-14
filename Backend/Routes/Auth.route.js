import { Router } from "express";
import { Login, Register } from "../Controller/Auth.Controller.js";

const Auth = Router();

Auth.post("/Register", Register);
Auth.post("/Login", Login);

export default Auth;
