const db = require('../config/db.config');

const Categories = {

    findAll: async () => {
        const result = await db.query('SELECT * FROM categories ORDER BY id ');
        return result.rows;
    },

    findOne: async (id) => {
        const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
        return result.rows[0];
    },

    create: async (data) => {
        const { id,parent_id,name,description,created_at } = data;
            const result = await db.query(
                'INSERT INTO categories (id, parent_id, name, description, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, parent_id, name, description, created_at]
        );
        return result.rows[0];
    },

    update: async (data) => {
        const { id,parent_id,name,description,created_at } = data;
        const result = await db.query(
            'UPDATE categories SET parent_id = $1, name = $2, description = $3, created_at = $4 WHERE id = $5 RETURNING *',
            [parent_id, name, description, created_at, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },

    filternbyCateogryId: async (id) => {
        const result = await db.query('SELECT * FROM categories WHERE parent_id = $1', [id]);
        return result.rows;
    }
}

module.exports = Categories;