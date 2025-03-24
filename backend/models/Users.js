const db = require('../config/db.config');

const Users = {

    findAll: () => {
        return db.query('SELECT * FROM users ORDER BY id ASC');
    },

    findOne: (id) => {
        return db.query('SELECT * FROM users WHERE id = $1', [id]);
    },

    create: (data) => {
        const { id,username,password_hash,email,created_at } = data;
        return db.query(
            'INSERT INTO users (id, username, password_hash, email, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, username, password_hash, email, created_at]
        );
    },

    update : (data) => {
        const { id,username,password_hash,email,created_at } = data;
        return db.query(
            'UPDATE users SET username = $1, password_hash = $2, email = $3, created_at = $4 WHERE id = $5 RETURNING *',
            [username, password_hash, email, created_at, id]
        );
    },

    delete : (id) => {
        return db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    },

}

module.exports = Users;