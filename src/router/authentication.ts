import { Router } from "express";

import { register } from "../controllers/authentication";

export default (router: Router) => {
  router.post("/auth/register", register); // User registration route is http://localhost:8080/auth/register
};
