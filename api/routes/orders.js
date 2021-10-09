var express = require('express');
//var path = require('path');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {

    res.status(200).json({
        message: "Orders was fetched"
    });

});


router.post('/', function (req, res, next) {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(200).json({
        message: "Orders was created",
        createdOrder: order
    });

});


router.get('/:orderId', function (req, res, next) {

    res.status(200).json({
        message: "Updated the Product"
    });


});

router.delete('/:orderId', function (req, res, next) {
   
    res.status(200).json({
        message: "Deleted the Order"
    });

});


module.exports = router;