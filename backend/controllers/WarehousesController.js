const Warehouses = require("../models/Warehouses");

const FindAll = async () => {
    try {
        const warehouses = await Warehouses.findAll();
        console.log(warehouses);
    } catch (error) {
        console.error('Error fetching warehouses:', error);
    }
};

const FindOne = async (id) => {
    try {
        const warehouse = await Warehouses.findOne(id);
        console.log(warehouse);
    } catch (error) {
        console.error('Error fetching warehouse:', error);
    }
};

const Create = async (data) => {
    try {
        const warehouse = await Warehouses.create(data);
        console.log(warehouse);
    } catch (error) {
        console.error('Error creating warehouse:', error);
    }
};

const Update = async (id, data) => {
    try {
        const warehouse = await Warehouses.update(id, data);
        console.log(warehouse);
    } catch (error) {
        console.error('Error updating warehouse:', error);
    }
};

const Delete = async (id) => {
    try {
        const warehouse = await Warehouses.delete(id);
        console.log(warehouse);
    } catch (error) {
        console.error('Error deleting warehouse:', error);
    }
};

module.exports = {
    FindAll, FindOne, Create, Update, Delete
};