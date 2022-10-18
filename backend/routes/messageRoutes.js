const router = require("express").Router();
const messageController = require("../controler/messagController");
const multer = require("multer");
const upload = multer();

router.get("/", messageController.createPost);
router.get("/:id", messageController.userPost);
router.post("/", upload.single("file"), messageController.createPost);
router.put("/:id", messageController.updatePost);
router.delete("/:id", messageController.deletePost);
router.patch("/like-post/:id", messageController.likePost);
router.patch("/unlike-post/:id", messageController.unlikePost); 

// comments
router.patch("/comment-post/:id", messageController.commentPost);
router.patch("/edit-comment-post/:id", messageController.editCommentPost);
router.patch("/delete-comment-post/:id", messageController.deleteCommentPost);
module.exports = router;
