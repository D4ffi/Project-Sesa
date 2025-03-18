const Permissions = require("../models/Permissions");

const FindAll = async () => {
    try {
        const permissions = await Permissions.findAll();
        console.log(permissions);
    } catch (error) {
        console.error('Error fetching permissions:', error);
    }
};

const FindOne = async (id) => {
    try {
        const permission = await Permissions.findOne(id);
        console.log(permission);
    } catch (error) {
        console.error('Error fetching permission:', error);
    }
};

const Create = async (data) => {
    try {
        const permission = await Permissions.create(data);
        console.log(permission);
    } catch (error) {
        console.error('Error creating permission:', error);
    }
};

const Update = async (id, data) => {
    try {
        const permission = await Permissions.update(id, data);
        console.log(permission);
    } catch (error) {
        console.error('Error updating permission:', error);
    }
};

const Delete = async (id) => {
    try {
        const permission = await Permissions.delete(id);
        console.log(permission);
    } catch (error) {
        console.error('Error deleting permission:', error);
    }
};

module.exports = {
    FindAll, FindOne, Create, Update, Delete
};