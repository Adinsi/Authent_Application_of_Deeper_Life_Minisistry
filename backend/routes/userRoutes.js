const router = require('express').Router();
const authControler = require('../controler/authControler');
const uploadControler = require('../controler/uploadControler');
const UserControler = require('../controler/UserControler');
const userAuthMiddelware = require('../middleware/auth.middleware');
const multer = require('multer');
const upload = multer();

// Auth
router.post('/register', authControler.signUp);
router.post('/login', authControler.signIn);
router.get('/jwt', authControler.verifyToken,authControler.getUser);
router.get('/refresh', authControler.RefreshToken,authControler.verifyToken,authControler.getUser);
router.get('/logout', authControler.logOut);

   
//user DB
router.get('/', UserControler.getAllUsers);
router.get('/:id', UserControler.userInfo);
router.put('/:id', UserControler.UpdateUser);
router.delete('/:id', UserControler.deleteUser);




//Mettre a jour le tablaeu des utilisateurs
router.patch("/follow/:id", UserControler.follow);
router.patch("/unfollow/:id", UserControler.unfollow);


// Upload d'image
router.post('/upload', upload.single('file'), uploadControler.uploadProfil);


 
module.exports = router;




