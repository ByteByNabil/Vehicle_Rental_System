import { pool } from "../../config/db";

const createUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string,
) => {
  const result = await pool.query(
    `
          INSERT INTO users (name, email, password, phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, password, phone, role],
  );
  return result;
};

const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getUserById = async (userId: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);
  return result;
};

const updateUserById = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string,
  userId: string,
) => {
  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2, password = $3, phone = $4, role = $5 WHERE id = $6 RETURNING *`,
    [name, email, password, phone, role, userId],
  );

  return result;
};

const deleteUserById = async (userId: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1 `, [userId]);
  return result;
};

export const userServices = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
