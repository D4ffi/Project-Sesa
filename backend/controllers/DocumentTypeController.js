const DocumentTypeController = require("../models/DocumentType");

const FindAll = async () => {
    try {
        const documentType = await DocumentType.findAll();
        console.log(documentType);
    } catch (error) {
        console.error('Error fetching documentType:', error);
    }
}

const FindOne = async (id) => {
    try {
        const documenType = await DocumentType.findOne(id);
        console.log(documenType);
    } catch (error) {
        console.error('Error fetching documentType:', error);
    }
}

const Create = async (data) => {
    try {
        const documenType = await DocumentType.create(data);
        console.log(documenType);
    } catch (error) {
        console.error('Error creating documentType:', error);
    }
}

const Update = async (id, data) => {
    try {
        const documenType = await DocumentType.update(id, data);
        console.log(documenType);
    } catch (error) {
        console.error('Error updating documentType:', error);
    }
}

const Delete = async (id) => {
    try {
        const documenType = await DocumentType.delete(id);
        console.log(documenType);
    } catch (error) {
        console.error('Error deleting documentType:', error);
    }
}

module.exports = {
    FindAll, FindOne, Create, Update, Delete
};