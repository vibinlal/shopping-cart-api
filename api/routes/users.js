var express = require('express');
var router = express.Router();
var uservalidator = require('../../validator/user-validator')
var usermodel = require('../models/user')
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var constants = require('../../config/constants')

//require('dotenv').config();

router.post('/signup', uservalidator.validateUserMaster, function (req, res, next) {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    res.status(403).json({
      error: errors.array()
    });
  }

  else {

    let UserDet = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      createdDate: new Date(),
      isUser: 1
    }

    usermodel.doSignup(UserDet).then((id) => {
      let UserId = id
      usermodel.GetUser(UserId).then((response) => {
        if (response.status) {
          res.status(201).json({
            UserId: UserId
          });

        }
        else {
          res.status(403).json({
            error: errors.array()
          });
        }

      })

    })

  }

});

router.post('/login', uservalidator.validateLogin, function (req, res, next) {

  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {

    res.status(403).json({
      error: errors.array()
    });

  }
  else {
    usermodel.dologin(req.body).then((response) => {

      if (response.status) {
        // let key = process.env.JWT_KEY;
     
        let user = {
          id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          phonenumber: response.user.phonenumber,
          isUser: response.user.isUser
        }

        let accesstoken = jwt.sign(user, constants.JWT_ACCESSKEY, { expiresIn: constants.JWT_ACCESS_EXPIN });
        let refreshtoken = jwt.sign(user, constants.JWT_REFREASHKEY, { expiresIn: constants.JWT_REFREASH_EXPIN });

        res.status(201).json({
          msg: "Auth successfull",
          token: accesstoken,
          refreshToken: refreshtoken,
          user: user
        });
      }
      else {

        var Sererrors = errors.array();
        Sererrors.push({ "msg": "Auth Failed" });
        //Sererrors.push({value: '',msg: 'Enter a valid email address',param: 'email',location: 'body'}); 
        return res.status(403).json({
          errors: Sererrors
        });


      }

    })

  }


});

router.post('/renewAccessToken', function (req, res, next) {

  let refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({    
      status :11, 
      Message: "user not auth"
    });
  }
  
  jwt.verify(refreshToken, "refreshkey", (err, userData) => {

    if (!err) {

      let user = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        phonenumber: userData.phonenumber,
        isUser: userData.isUser
      }

      let accesstoken = jwt.sign(user, constants.JWT_ACCESSKEY, { expiresIn: constants.JWT_ACCESS_EXPIN });
      let refreshtoken = jwt.sign(user, constants.JWT_REFREASHKEY, { expiresIn: constants.JWT_REFREASH_EXPIN });

      res.status(201).json({
        msg: "Auth successfull",
        token: accesstoken,
        refreshtoken: refreshtoken,
        user: user
      });

    }
    else {
      return res.status(401).json({
        Message: "user not auth"
      });
    }

  });

});


module.exports = router;
