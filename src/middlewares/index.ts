import { NextFunction, Request, Response } from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    const isAdmin = get(req, "identity.role") === "admin";

    // Check if the user is authenticated
    if (!currentUserId) {
      return res.sendStatus(403);
    }

    // Check if the user is authorized (owner of the resource or admin)
    if (currentUserId.toString() !== id && !isAdmin) {
      return res.sendStatus(403);
    }

    // Continue to users controller
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

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
