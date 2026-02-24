import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signUpUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string,
) => {
  const hashedPass = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `
          INSERT INTO users (name, email, password, phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, hashedPass, phone, role],
  );
  return result;
};

const signInUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1 `, [
    email,
  ]);

  // if (result.rows.length === 0) {
  //   return null;
  // }
  if (result.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);

  // if (!match) {
  //   return false;
  // }

  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    },
  );
  // console.log({ token });
  // const { password, ...userWithoutPassword } = user;
  // return { token, user: userWithoutPassword };
  return { token, user }; // user contains password!
};

export const authServices = {
  signUpUser,
  signInUser,
};
