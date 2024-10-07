const express = require("express");
const router = express.Router();
const book_controller = require("../controllers/book.controller");
const { authUser } = require("../middleware/auth");
const upload = require("../middleware/multer");

router.post("/createbook", authUser,  upload.fields([{ name: "image", maxCount: 1 }]), book_controller.createbook)
router.get("/book_list",  book_controller.getallbooks)
router.put("/update_book", authUser, upload.fields([{ name: "image", maxCount: 1 }]), book_controller.updatebook)
router.delete("/book_delete", authUser, book_controller.deletebook)
router.put('/borrow', authUser, book_controller.borrowBook);
router.put('/return', authUser, book_controller.returnBook);



module.exports = router;