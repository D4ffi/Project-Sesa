const Orders = require("../models/Orders");

const FindAll = async () => {
    try {
        const orders = await Orders.findAll();
        console.log(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};const FindOne = async (id) => {
    try {
        const order = await Orders.findOne(id);
        console.log(order);
    } catch (error) {
        console.error('Error fetching order:', error);
    }
};const Create = async (data) => {
    try {
        const order = await Orders.create(data);
        console.log(order);
    } catch (error) {
        console.error('Error creating order:', error);
    }
};const Update = async (id, data) => {
    try {
        const order = await Orders.update(id, data);
        console.log(order);
    } catch (error) {
        console.error('Error updating order:', error);
    }
};const Delete = async (id) => {
    try {
        const order = await Orders.delete(id);
        console.log(order);
    } catch (error) {
        console.error('Error deleting order:', error);
    }
};

module.exports = {
    FindAll, FindOne, Create, Update, Delete
};