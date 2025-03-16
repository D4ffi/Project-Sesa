const Categories = require('../models/Categories');

const FindAll = async () => {
    try {
        const categories = await Categories.findAll();
        console.log(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const FindOne = async (id) => {
    try {
        const categories = await Categories.findOne(id);
        console.log(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

const Create = async (data) => {
    try {
        const categories = await Categories.create(data);
        console.log(categories);
    } catch (error) {
        console.error('Error creating categories:', error);
    }
}

module.exports = {
    FindAll, FindOne, Create
}