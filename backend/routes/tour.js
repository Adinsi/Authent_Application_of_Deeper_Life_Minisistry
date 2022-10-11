const express = require('express')
const router = express.Router();
const tourController = require("../controler/tourController.js");


router.post('/',tourController.createTour );
router.get('/',tourController.getTours );

module.exports = router; 