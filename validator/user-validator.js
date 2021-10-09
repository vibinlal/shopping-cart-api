const { body, validationResult } = require('express-validator');
var usermodel = require('../api/models/user')

module.exports.validateUserMaster = [
    body('name', "Enter the name").not().isEmpty().trim().escape(),
    body('email', "Enter a valid email address").isEmail(),
    body('password', "Enter the Password with min 4+ character length").isLength({ min: 4 }),    
    body('phonenumber', "Enter a valid phone number").not().isEmpty().matches(/\d/).withMessage('must contain a number'),
    //body('confirmPassword', "Password not matching").equals(body.password),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('confirmation Password does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
     }),
    body('email').custom(value => {
        return usermodel.findUserByEmail(value).then(user => {
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        });
    })
],

module.exports.validateLogin = [
    body('email', "Enter a valid email address").isEmail(),
    body('password', "Enter the Password").not().isEmpty().trim().escape()
]