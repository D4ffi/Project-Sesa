const db = require('../config/db.config');

const ProductImages = {

    findAll: async (product_id) => {
        const result = await db.query('SELECT * FROM product_images WHERE product_id = $1', [product_id]);
        return result.rows;
    },

    findout: async (product_id) => {
        const result = await db.query('SELECT * FROM product_images WHERE product_id = $1', [product_id]);
        return result.rows[0];
    },

    create: async (data) => {
        const { id, product_id, url, is_primary, alt_text, created_at } = data;
        const result = await db.query(
            'INSERT INTO product_images (id, product_id, image, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, product_id, url, is_primary, alt_text, created_at]
        );
        return result.rows[0];
    },

    update: async (data) => {
        const { id, product_id, url, is_primary, alt_text, created_at } = data;
        const result = await db.query(
            'UPDATE product_images SET product_id = $1, url = $2, is_primary = $3, alt_text = $4, created_at = $5 WHERE id = $6 RETURNING *',
            [id, product_id, url, is_primary, alt_text, created_at]
        );
        return result.rows[0];
    },
}