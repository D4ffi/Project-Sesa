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

    //todo: implement update, delete and filterByCategory methods

    update: async (id, data) => {

    },

    delete: async (id) => {

    },

    filterByCategory: async (categoryId) => {

    },
}

module.exports = Categories;