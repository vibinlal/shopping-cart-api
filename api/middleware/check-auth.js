const jwt = require('jsonwebtoken');
var constants = require('../../config/constants')

module.exports = (req, res, next) => {
    try {

        let token = req.headers['authorization'];
        token = token.split(' ')[1]; // accesstoken
        console.log('TOKEN DET')
        console.log(token)

        jwt.verify(token, constants.JWT_ACCESSKEY, (err, user) => {

            if (!err) {
                console.log(user);
                req.userData = user;
                next();
            }
            else {
                return res.status(401).json({
                    Message: "auth failed"
                });
            }

        });
    }
    catch (error) {
        return res.status(401).json({
            Message: "auth failed"
        });
    }

}
