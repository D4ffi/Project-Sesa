const db = require ('../config/db.config');

const Services = {

    findAll: (query) => {
        const result = db.query(`SELECT * FROM services ORDER BY id`);
        return result.rows;
    },

    findOne: (query) => {
        const result = db.query(`SELECT * FROM services WHERE id = $1`, [query]);
        return result.rows[0];
    },

    create: (query) => {
        const {id, name, description} = query;
        const result = db.query(`INSERT INTO services (id, name, description) VALUES ($1, $2, $3) RETURNING *`,
            [id, name, description]);
        return result.rows[0];
    },

    update: (query) => {
        const {id, name, description} = query;
        const result = db.query(`UPDATE services SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
            [name, description, id]);
        return result.rows[0];
    },

    delete: (query) => {
        const result = db.query(`DELETE FROM services WHERE id = $1`, [query]);
        return result.rows[0];
    },

}

module.exports = Services;