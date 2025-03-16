const db = require('../config/db.config');

const Roles = {

    findAll: async (id) => {
        const roles = await db.query('SELECT * FROM roles ORDER BY id');
        return roles.rows;
    },

    findOne: async (id) => {
        const role = await db.query('SELECT * FROM roles WHERE id = $1', [id]);
        return role.rows[0];
    },

    create: async (data) => {
        const { id, name, description} = data;
        const result = await db.query( 'INSERT INTO roles (id, name, description) VALUES ($1, $2, $3) RETURNING *', [id, name, description]);
        return result.rows[0];
    },

    update: async (id, data) => {
        const { name, description} = data;
        const result = await db.query('UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id]);
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await db.query('DELETE FROM roles WHERE id = $1', [id]);
        return result.rows[0];
    }

}