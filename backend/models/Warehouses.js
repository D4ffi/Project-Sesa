const db = require ('../config/db.config');

const Warehouses = {

    findAll: (query) => {
        const result = db.query(`SELECT * FROM warehouses ORDER BY id`);
        return result.rows;
    },

    findOne: (query) => {
        const result = db.query(`SELECT * FROM warehouses WHERE id = $1`, [query]);
        return result.rows[0];
    },

    create: (query) => {
        const { id,supervisor_id, name, location,active, created_at } = query;
        const result = db.query(`INSERT INTO warehouses (id,supervisor_id, name, location,active, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [id,supervisor_id, name, location,active, created_at]);
        return result.rows[0];
    },

    update: (query) => {
        const { id,supervisor_id, name, location,active, created_at } = query;
        const result = db.query(`UPDATE warehouses SET supervisor_id = $1, name = $2, location = $3, active = $4, created_at = $5 WHERE id = $6 RETURNING *`,
            [supervisor_id, name, location,active, created_at, id]);
        return result.rows[0];
    },

    delete: (query) => {
        const result = db.query(`DELETE FROM warehouses WHERE id = $1`, [query]);
        return result.rows[0];
    },
}

module.exports = Warehouses;