const db = require('../config/db.config');

const WarehouseInventory = {

    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM warehouse_inventory');
        return rows;
    },

    findOneById: async (id) => {
        const [rows] = await db.query('SELECT * FROM warehouse_inventory WHERE product_id = ?', [id]);
        return rows;
    },

    create: async (data) => {
        const { warehouse_id, product_id, quantity, minimal_quantity } = data;
        const [rows] = await db.query('INSERT INTO warehouse_inventory (warehouse_id, product_id, quantity, minimal_quantity) VALUES (?, ?, ?, ?)',
            [warehouse_id, product_id, quantity, minimal_quantity]);
    },

    update: async (data) => {
        const { warehouse_id, product_id, quantity, minimal_quantity } = data;
        const [rows] = await db.query('UPDATE warehouse_inventory SET quantity = ?, minimal_quantity = ? WHERE warehouse_id = ? AND product_id = ?',
            [quantity, minimal_quantity, warehouse_id, product_id]);
    },

    delete: async (id) => {
        const [rows] = await db.query('DELETE FROM warehouse_inventory WHERE product_id = ?', [id]);
    }

}

module.exports = WarehouseInventory;