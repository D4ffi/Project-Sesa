const db = require('../config/db.config');

const Permissions = {

    findAll: async (id) => {
        const permissions = await db.query('SELECT * FROM permissions ORDER BY id');
        return permissions.rows;
    },

    findOne: async (id) => {
        const permission = await db.query('SELECT * FROM permissions WHERE id = $1', [id]);
        return permission.rows[0];
    },

    create: async (data) => {
        const { id, name, description, module} = data;
        const result = await db.query( 'INSERT INTO permissions (id, name, description, module) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, name, description, module]);
        return result.rows[0];
    },

    update: async (id, data) => {
        const { name, description, module} = data;
        const result = await db.query('UPDATE permissions SET name = $1, description = $2, module = $3 WHERE id = $4 RETURNING *',
            [name, description, module, id]);
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await db.query('DELETE FROM permissions WHERE id = $1', [id]);
        return result.rows[0];
    }

}