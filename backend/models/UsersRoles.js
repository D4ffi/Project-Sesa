const db = require('../config/db.config');

const UsersRoles = {

    findAll: async (product_id) => {
        const query = `SELECT *
                       FROM users_roles
                       WHERE product_id = ${product_id}`;
        return await db.query(query);
    }
}