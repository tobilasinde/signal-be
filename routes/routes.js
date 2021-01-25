const express = require('express');
const router = express.Router();

var authenticate = require('../controllers/Auth/authentication');
var media = require('../controllers/Media/media');

const validator = require("../controllers/Validator/validator");

/*************************************************************************
API CALL START
*************************************************************************/

/*************************************************************************
CREATE JWT TOKEN
*************************************************************************/
router.post('/',authenticate.createJWTToken)

/*************************************************************************
SIGNUP
*************************************************************************/
router.post('/signup', authenticate.signUp)

/////// MEDIA ROUTES ///////
/*************************************************************************
CREATE MEDIAS
*************************************************************************/
router.post('/media', validator.validate('/media/create'), media.createMedia)

/*************************************************************************
GET ALL MEDIAS
*************************************************************************/
router.get('/media', media.getMedias)

module.exports = router;