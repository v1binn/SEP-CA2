var express = require('express');
var router = express.Router();
let middleware = require('./middleware');
var review = require('../model/reviewDB.js');

router.get('/api/getReviewsBySku', function (req, res) {
    var sku = req.query.sku;
    review.getReviewsBySku(sku)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get reviews");
        });
});

router.post('/api/addReview', function (req, res) {
    var sku = req.body.sku;
    var rating = req.body.rating;
    var comment = req.body.comment;
    var memberEmail = req.body.memberEmail;
    
    // Basic validation
    if (!sku || !rating || !comment || !memberEmail) {
        return res.status(400).send("Missing required fields");
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).send("Rating must be between 1 and 5");
    }
    if (comment.length > 300) {
        return res.status(400).send("Comment too long");
    }
    
    review.addReview(sku, rating, comment, memberEmail)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add review");
        });
});

module.exports = router;