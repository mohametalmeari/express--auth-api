import { Router } from "express";

import { deleteUser, getAllUsers } from "../controllers/users";
import { isAuthenticated } from "../middlewares";

export default (router: Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.delete("/users/:id", deleteUser);
};
