const db = require('../config/db.config');

const RolePermissions = {

    findAll: async () => {
        const result = await db.query('SELECT * FROM role_permissions');
        return result.rows;
    },

    findOut: async (id) => {
        const result = await db.query('SELECT * FROM role_permissions WHERE id = $1', [id]);
        return result.rows[0];
    },

    create: async (data) => {
        const {role_id, permission_id } = data;
        const result = await db.query(
            'INSERT INTO role_permissions (id, role_id, permission_id, created_at) VALUES ($1, $2) RETURNING *',
            [role_id, permission_id]
        );
        return result.rows[0];
    },

    update: async (data) => {
        const { role_id, permission_id } = data;
        const result = await db.query(
            'UPDATE role_permissions SET role_id = $1, permission_id = $2 WHERE id = $3 RETURNING *',
            [role_id, permission_id]
        );
        return result.rows[0];
    },
}