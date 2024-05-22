const express = require('express');
const { signup, signin, employerSignUp, ChangePassword } = require('../controllers/auth');
const router = express.Router();
const { validateRequest, validatesigninRequest, isRequestValidated, EmployerValidateRequest, validChangePwdRequest } = require('../validator/auth');


router.post('/signin', validatesigninRequest, isRequestValidated, signin);
router.post('/signup', validateRequest, isRequestValidated, signup);
router.post('/changePassword', validChangePwdRequest, isRequestValidated, ChangePassword);

router.post('/EmployerSignup', EmployerValidateRequest, isRequestValidated, employerSignUp);
// router.post('/signout', isRequestValidated, signout );

// router.post('/profile', requireSignin, (req, res) => {
//     res.status(200).json({ user : "profile"});
// })

// 

module.exports = router;