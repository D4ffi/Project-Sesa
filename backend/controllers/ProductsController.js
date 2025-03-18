const Products = require("../models/Products");

const FindAll = async () => {
    try {
        const products = await Products.findAll();
        console.log(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const FindOne = async (id) => {
    try {
        const product = await Products.findOne(id);
        console.log(product);
    } catch (error) {
        console.error('Error fetching product:', error);
    }
};

const Create = async (data) => {
    try {
        const product = await Products.create(data);
        console.log(product);
    } catch (error) {
        console.error('Error creating product:', error);
    }
};

const Update = async (id, data) => {
    try {
        const product = await Products.update(id, data);
        console.log(product);
    } catch (error) {
        console.error('Error updating product:', error);
    }
};

const Delete = async (id) => {
    try {
        const product = await Products.delete(id);
        console.log(product);
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

module.exports = {
    FindAll, FindOne, Create, Update, Delete
};