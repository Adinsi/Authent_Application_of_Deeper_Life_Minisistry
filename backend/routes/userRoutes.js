const router = require("express").Router();
const authControler = require("../controler/authControler");
const uploadControler = require("../controler/uploadControler");
const UserControler = require("../controler/UserControler");
const userAuthMiddelware = require("../middleware/auth.middleware");
const multer = require("multer");
const upload = multer();

// Auth
router.put("/forget-password", authControler.forgetPassword);
router.put("/reset-password", authControler.resetPassword);
router.get("/jwt", authControler.verifyToken, authControler.getUser);
router.post("/logout",authControler.verifyToken, authControler.logOut);
router.post("/register", authControler.signUp);
router.post("/login", authControler.signIn);
router.get("/:id", UserControler.userInfo);
router.post("/upload", upload.single("file"), uploadControler.uploadProfil);
router.put("/:id", UserControler.UpdateUser);

router.delete("/:id",authControler.verifyToken, UserControler.deleteUser);

// Upload d'image

//user DB
router.get("/", authControler.verifyToken, UserControler.getAllUsers);
// router.get('/:id', UserControler.userInfo);

//Mettre a jour le tablaeu des utilisateurs
router.patch("/follow/:id", UserControler.follow);
router.patch("/unfollow/:id", UserControler.unfollow);

router.get(
  "/refresh",
  authControler.RefreshToken,
  authControler.verifyToken,
  authControler.getUser
);

module.exports = router;
