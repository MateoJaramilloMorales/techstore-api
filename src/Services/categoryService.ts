import { pool } from '../database.js';

export const getAllCategories = async () => {
    const res = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    return res.rows;
};

export const getCategoryById = async (id: string) => {
    const res = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return res.rows[0];
};

export const createCategory = async (name: string) => {
    const res = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
    return res.rows[0];
};

export const updateCategory = async (id: string, name: string) => {
    const res = await pool.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    return res.rows[0];
};

export const deleteCategory = async (id: string) => {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    return { message: "Categoría eliminada" };
};

export const getProductsByCategory = async (id: string) => {
    const res = await pool.query('SELECT * FROM products WHERE category_id = $1', [id]);
    return res.rows;
};