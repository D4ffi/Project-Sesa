const express = require('express');
const router = express.Router();
const db = require("../config/db.config.js");

router.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM products");
        res.json(result);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: 'Internal Server Error', err });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ error: 'No encontre ese producto' });
    }
});


module.exports = router;