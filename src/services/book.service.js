const book = require("../models/book.model")

const createbook = async (body) => {
    return await book.create(body);
};

const getAllbooks = async () => {
    return await book.find();
};

const getbookbyid = async (id) => {
    return await book.findById(id);
}


const updatebook = async (id, body) => {
    return await book.findByIdAndUpdate(id, { $set: body }, { new: true });
};

const deletebook = async (id) => {
    return await book.findByIdAndDelete(id);
};

const borrowbook = async (bookid, userid) => {
    return await book.findByIdAndUpdate(bookid, { $set: { available: false, borrowedBy: userid } }, { new: true })
}

const returnbook = async (bookid) => {
    return await book.findByIdAndUpdate(bookid, { $set: { available: true, borrowedBy: null } }, { new: true })
}

module.exports = {
    createbook,
    getAllbooks,
    deletebook,
    updatebook,
    getbookbyid,
    borrowbook,
    returnbook
};