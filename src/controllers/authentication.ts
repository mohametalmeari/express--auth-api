import { Request, Response } from "express";

import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if required fields are present
    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    // Check if user exists
    if (!user) {
      return res.sendStatus(400);
    }

    // Check if password is correct
    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    // Create session token
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    // Send session token as cookie
    res.cookie("AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    // Check if required fields are present
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }

    // Create user
    const salt = random();
    await createUser({
      email,
      username,
      authentication: { salt, password: authentication(salt, password) },
    });

    // Login user after registration:
    // - Get user after creation to get the _id
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    // - Create session token
    const sessionSalt = random();
    user.authentication.sessionToken = authentication(
      sessionSalt,
      user._id.toString()
    );

    await user.save();

    // - Send session token as cookie
    res.cookie("AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
