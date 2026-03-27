import { pool } from '../database.js';

export const getAllProducts = async () => {
    const res = await pool.query('SELECT * FROM products ORDER BY id ASC');
    return res.rows;
};

export const getProductById = async (id: string) => {
    const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return res.rows[0];
};

export const createProduct = async (data: any) => {
    const { name, price, stock, category_id } = data;
    const res = await pool.query(
        'INSERT INTO products (name, price, stock, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, price, stock, category_id]
    );
    return res.rows[0];
};

export const updateProduct = async (id: string, data: any) => {
    const { name, price, stock } = data;
    const res = await pool.query(
        'UPDATE products SET name = COALESCE($1, name), price = COALESCE($2, price), stock = COALESCE($3, stock) WHERE id = $4 RETURNING *',
        [name, price, stock, id]
    );
    return res.rows[0];
};

export const deleteProduct = async (id: string) => {
    // El try-catch se maneja en el app.ts para enviar el error 500 correspondiente
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
};