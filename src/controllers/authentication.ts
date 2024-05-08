import { Request, Response } from "express";
import { createUser, getUserByEmail } from "db/users";
import { authentication, random } from "helpers";

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
    const user = await createUser({
      email,
      username,
      authentication: { salt, password: authentication(salt, password) },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
