const db = require('../config/db.config');

const DocumentType = {

    findAll: async (id) => {
        const documentTypes = await db.query('SELECT * FROM document_type ORDER BY id');
        return documentTypes.rows;
    },

    findOne: async (id) => {
        const documentType = await db.query('SELECT * FROM document_type WHERE id = $1', [id]);
        return documentType.rows[0];
    },

    create: async (data) => {
        const { id, name, description} = data;
        const result = await db.query( 'INSERT INTO document_type (id, name, description) VALUES ($1, $2, $3) RETURNING *', [id, name, description]);
        return result.rows[0];
    },

    update: async (id, data) => {
        const { name, description} = data;
        const result = await db.query('UPDATE document_type SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id]);
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await db.query('DELETE FROM document_type WHERE id = $1', [id]);
        return result.rows[0];
    },

}

module.exports = DocumentType;