const db = require("../config/db.config");

const ServiceDetail= {
    findAll: async () => {
        const result = await db.query('SELECT * FROM service_detail ORDER BY id ');
        return result.rows;
   },

    findOne: async (id) => {
        const result = await db.query('SELECT * FROM service_detail WHERE id = $1', [id]);
        return result.rows[0];
    },

    create: async (data) => {
        const {service_id,product_id,added_price } = data;
        const result = await db.query(
            'INSERT INTO service_detail (service_id, product_id, added_price) VALUES ($1, $2, $3) RETURNING *',
            [service_id, product_id, added_price]
        );
        return result.rows[0];
    },

    update: async (data) => {
        const {service_id,product_id,added_price } = data;
        const result = await db.query(
            'UPDATE service_detail SET product_id = $1, added_price = $2 WHERE service_id = $3 RETURNING *',
            [product_id, added_price, service_id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await db.query('DELETE FROM service_detail WHERE service_id = $1 RETURNING *', [id]);
        return result.rows[0];
    },






}