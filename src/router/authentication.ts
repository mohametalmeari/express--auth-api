import { Router } from "express";

import { login, register } from "../controllers/authentication";

export default (router: Router) => {
  router.post("/auth/register", register); // User registration route is http://localhost:8080/auth/register
  router.post("/auth/login", login); // User login route is http://localhost:8080/auth/login
};
