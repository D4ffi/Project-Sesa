const db = require('../config/db.config');

const Products = {

    findAll: async () => {
        const result = await db.query('SELECT * FROM products ORDER BY id ');
        return result.rows;
    },

    findOne: async (id) => {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0];
    },

    create: async (data) => {
        const { id, category_id, name, description, price, sku, created_at } = data;
        const result = await db.query(
            'INSERT INTO products (id,category_id, name, description, price, sku, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id,category_id, name, description, price, sku, created_at]
        );
        return result.rows[0];
    },

    update: async (id, data) => {
        const { id, category_id, name, description, price, sku, created_at} = data;
        const result = await db.query(
            'UPDATE products SET category_id = $1, name = $2, description = $3, price = $4, sku = $5, created_at = $6 WHERE id = $7 RETURNING *',
            [category_id, name, description, price, sku, created_at, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await db.query('DELETE FROM products WHERE id = $1', [id]);
        return result.rows[0];
    },
}