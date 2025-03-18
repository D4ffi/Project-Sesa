const Roles = require("../models/Roles");

const FindAll = async () => {
    try {
        const roles = await Roles.findAll();
        console.log(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
};const FindOne = async (id) => {
    try {
        const role = await Roles.findOne(id);
        console.log(role);
    } catch (error) {
        console.error('Error fetching role:', error);
    }
};const Create = async (data) => {
    try {
        const role = await Roles.create(data);
        console.log(role);
    } catch (error) {
        console.error('Error creating role:', error);
    }
};const Update = async (id, data) => {
    try {
        const role = await Roles.update(id, data);
        console.log(role);
    } catch (error) {
        console.error('Error updating role:', error);
    }
};

module.exports = {
    FindAll, FindOne, Create, Update
}