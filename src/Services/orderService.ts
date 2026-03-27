import { pool } from '../database.js';

export const getAllOrders = async () => {
    const res = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    return res.rows;
};

export const getOrderById = async (id: string) => {
    const res = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    return res.rows[0];
};

export const createOrder = async (customerName: string, items: any[]) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        let total = 0;
        // Calculamos el total buscando precios reales en la DB
        for (const item of items) {
            const prod = await client.query('SELECT price FROM products WHERE id = $1', [item.productId]);
            if (prod.rows.length === 0) throw new Error(`Producto ${item.productId} no existe`);
            total += parseFloat(prod.rows[0].price) * item.quantity;
        }

        const orderRes = await client.query(
            'INSERT INTO orders (customer_name, total) VALUES ($1, $2) RETURNING *',
            [customerName, total]
        );

        await client.query('COMMIT');
        return orderRes.rows[0];
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};