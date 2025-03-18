const db = require ('../config/db.config');

const Orders  = {

    findAll: async (id) => {
        const orders = await db.query('SELECT * FROM orders ORDER BY id');
        return orders.rows;
    },

    findOne: async (id) => {
        const order = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
        return order.rows[0];
    },

    create: async (data) => {
        const { id, user_id, doc_type, total, subtotal, tax, created_at} = data;
        const result = await db.query('INSERT INTO orders (id, user_id,doc_type, total, subtotal, tax, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id, user_id, doc_type, total, subtotal, tax, created_at]);
        return result.rows[0];
    },

    update: async (data) => {
        const { id, user_id, doc_type, total, subtotal, tax, created_at} = data;
        const result = await db.query('UPDATE orders SET user_id = $1, doc_type = $2, total = $3, subtotal = $4, tax = $5, created_at = $6 WHERE id = $7 RETURNING *',
            [user_id, doc_type, total, subtotal, tax, created_at, id]);
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await db.query('DELETE FROM orders WHERE id = $1', [id]);
        return result.rows[0];
    }

}

module.exports = Orders;