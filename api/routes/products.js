var express = require('express');
var path = require('path');
var router = express.Router();
var productModel = require('../models/product')
const checkAuth = require('../middleware/check-auth')

/* GET users listing. */
router.get('/', checkAuth, function (req, res, next) {

    productModel.getAllProduct().then((products) => {
        res.status(200).json({
           // user : req.body.userData,
            products: products
        });

    }).catch((err) => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })

});


router.post('/', checkAuth, function (req, res, next) {

    // if (!req.files) {
    //     res.status(200).json({
    //         error: "File was not found"
    //     });
    //     return;
    // }


    let extension = '';
    let image

    if (req.files) {
        image = req.files.image;
        let ImageName = req.files.image.name;
        extension = (path.extname(ImageName));
    }
    else {
        console.log('no image found')
    }

    let products = {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        imageExtention: extension,
        createdDate : new Date()
    }

    productModel.addProduct(products, (id, err) => {

        if (extension != "" ) {
            image.mv('../../public/product_images/' + id + extension, (err, done) => {
                if (!err) {
                    res.status(200).json({
                        productsId: id
                    });
                }
                else {

                    console.log('error while saving image ' + err)
                    res.status(200).json({
                        productsId: id,
                        error: err
                    });

                }
            })
        }
        else {
            res.status(200).json({
                productsId: id
            });
        }

    })

});


router.get('/:productId', (req, res, next) => {

    var id = req.params.productId;
    if (id === "special") {
        res.status(200).json({
            message: "Insert Products method",
            id: id
        });
    }
    else {
        res.status(200).json({
            message: "You passed an Id"
        });
    }


});

router.patch('/:productId', (req, res, next) => {
    var id = req.params.productId;
    let updateops = {};
    for (let ops of req.body) {
        updateops[ops.propName] = ops.value;
    }
    console.log(updateops);

    res.status(200).json({
        message: "Updated the Product"
    });

});

router.delete('/:productId', (req, res, next) => {
    var id = req.params.productId;
    res.status(200).json({
        message: "Deleted the Product"
    });

});


module.exports = router;