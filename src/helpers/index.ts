import * as dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const random = () => crypto.randomBytes(128).toString("base64");
const authentication = (salt: string, password: string) =>
  crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.SECRET)
    .digest("hex");

export { random, authentication };
