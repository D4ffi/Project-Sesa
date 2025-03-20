const db = require('../config/db.config');

const Order_Detail = {

    findAll: async () => {
        const result = await db.query('SELECT * FROM order_detail ORDER BY id ');
        return result.rows;
    },

    findOne: async (id) => {
        const result = await db.query('SELECT * FROM order_detail WHERE id = $1', [id]);
        return result.rows[0];
    },

    create: async (data) => {
        const {order_id,product_id,quantity,} = data;
            const result = await db.query(
                'INSERT INTO order_detail (id, order_id, product_id, quantity, price, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [order_id, product_id, quantity]
        );
        return result.rows[0];
    },

    update : async (data) => {
        const {order_id,product_id,quantity,} = data;
        const result = await db.query(
            'UPDATE order_detail SET order_id = $1, product_id = $2, quantity = $3 WHERE id = $4 RETURNING *',
            [order_id, product_id, quantity, id]
        );
        return result.rows[0];
    }


}