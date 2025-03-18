const Services = require("../models/Services");

const FindAll = async () => {
    try {
        const services = await Services.findAll();
        console.log(services);
    } catch (error) {
        console.error('Error fetching services:', error);
    }
};

const FindOne = async (id) => {
    try {
        const service = await Services.findOne(id);
        console.log(service);
    } catch (error) {
        console.error('Error fetching service:', error);
    }
};

const Create = async (data) => {
    try {
        const service = await Services.create(data);
        console.log(service);
    } catch (error) {
        console.error('Error creating service:', error);
    }
};

const Update = async (id, data) => {
    try {
        const service = await Services.update(id, data);
        console.log(service);
    } catch (error) {
        console.error('Error updating service:', error);
    }
};

const Delete = async (id) => {
    try {
        const service = await Services.delete(id);
        console.log(service);
    } catch (error) {
        console.error('Error deleting service:', error);
    }
};

module.exports = {
    FindAll, FindOne, Create, Update, Delete
};