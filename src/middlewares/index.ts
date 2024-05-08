import { NextFunction, Request, Response } from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies["AUTH"];

    // Check if the session token exists
    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    // Check if the user exists
    if (!existingUser) {
      res.sendStatus(403);
    }

    // Attach the user to the request object
    merge(req, { identity: existingUser });

    // Continue to users controller
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
