const book_service = require("../services/book.service")
const fs = require("fs")
const path = require('path');

const createbook = async (req, res) => {
    const reqbody = req.body;
    console.log("🚀 ~ createbook ~ reqbody:", reqbody)
    try {
        if (!reqbody.title || !reqbody.author || !reqbody.genre || !reqbody.bookPrice) {
            return res.status(400).json({ message: "fil tha all fild" })
        }
        if (!req.files || !req.files.image || req.files.image.length === 0) {
            return res.status(400).json({ message: "Image is required" });
        }
        const image = "/public/temp/" + req.files.image[0].filename;
        console.log("🚀 ~ createbook ~ image:", image)
        const body = {
            title: reqbody.title,
            author: reqbody.author,
            genre: reqbody.genre,
            bookPrice: reqbody.bookPrice,
            image: image
        };
        const Book = await book_service.createbook(body);
        console.log("🚀 ~ createbook ~ Book:", Book)

        return res.status(200).json({ message: "create Book successfully", data: Book });
    } catch (err) {
        console.log("🚀 ~ createbook ~ err:", err)
        return res.status(500).json({ message: 'Error creating Book', error: err });
    }
}

const getallbooks = async (req, res) => {
    try {
        const books = await book_service.getAllbooks();
        return res.status(200).json({ message: "all  books", data: books });

    } catch (err) {
        return res.status(500).json({ message: 'Error fetching books', error: err });
    }
}


const updatebook = async (req, res) => {
    try {
        const bookid = req.body.id;
        const book = await book_service.getbookbyid(bookid)
        if (!book) {
            return res.status(400).json({ message: "book not  found" });

        }
        console.log("🚀 ~ updatebook ~ bookid:", bookid)
        const body = {};
        if (req.body) {
            body.title = req.body.title,
                body.author = req.body.author,
                body.genre = req.body.genre,
                body.bookPrice = req.body.bookPrice
        }
        if (req.files && req.files.image) {
            const relativePath = book.image;
            const fullPath = path.join(__dirname, '..', relativePath);
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.log(`An error occurred while deleting the image: ${err.message}`);
                } else {
                    console.log("Deleted old image");
                }
            });
            body.image = "/public/temp/" + req.files.image[0].filename;
        }
        console.log("🚀 ~ updatebook ~ body.image:", body.image)
        const updatedbook = await book_service.updatebook(bookid, body);

        return res.status(200).json({ message: "update book successfully", data: updatedbook });
    } catch (err) {
        console.log("🚀 ~ updatebook ~ err:", err)
        return res.status(500).json({ error: 'Server error' });
    }
}

const deletebook = async (req, res) => {
    try {
        const bookid = req.body.id;
        const book = await book_service.getbookbyid(bookid);
        if (!book) {
            return res.status(404).json({ message: 'book not found' });
        }
        const deletedbook = await book_service.deletebook(bookid);
        return res.status(200).json({ message: "delete book successfully" });
    } catch (err) {
        console.log("🚀 ~ deletebook ~ err:", err)
        return res.status(500).json({ error: 'Server error' });
    }
}

const borrowBook = async (req, res) => {
    try {
        const bookid = req.body.id;
        const userid = req.user._id;
        const book = await book_service.getbookbyid(bookid);
        if (!book) {
            return res.status(404).json({ message: 'book not found' });
        }
        console.log("🚀 ~ borrowBook ~ book:", book)
        if (!book.available) {
            return res.status(400).json({ message: 'Book is already borrowed' });
        }

        book.available = false;
        const borrowBook = await book_service.borrowbook(bookid, userid)
        console.log("🚀 ~ borrowBook ~ borrowBook:", borrowBook)
        return res.status(200).json({ message: "Book successfully borrowed", data: borrowBook });
    } catch (error) {
        console.log("🚀 ~ borrowBook ~ error:", error)
        return res.status(500).json({ message: 'Server error' });
    }
}

const returnBook = async (req, res) => {
    try {
        const bookid = req.body.id;
        const book = await book_service.getbookbyid(bookid);
        if (!book) {
            return res.status(404).json({ message: 'book not found' });
        }
        if (book.available) {
            return res.status(400).json({ message: 'Book is not borrowed' });
        }

        book.available = true;
        book.borrowedBy = null;
        const returnBook = await book_service.returnbook(bookid)
        await book.save();
        return res.status(200).json({ message: "Book is return", data: returnBook });
    } catch (error) {
        console.log("🚀 ~ returnBook ~ error:", error)
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    createbook,
    getallbooks,
    updatebook,
    deletebook,
    borrowBook,
    returnBook
}