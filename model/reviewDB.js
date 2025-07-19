var db = require('./databaseConfig.js');
var Review = require('./review.js');

var reviewDB = {
    getReviewsBySku: function (sku) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                } else {
                    var sql = 'SELECT r.rating, r.comment, r.created_at as createdAt, m.name as memberName ' +
                              'FROM reviews r ' +
                              'JOIN memberentity m ON r.member_id = m.id ' +
                              'JOIN itementity i ON r.item_id = i.id ' +
                              'WHERE i.sku = ? ' +
                              'ORDER BY r.created_at DESC';
                    conn.query(sql, [sku], function (err, result) {
                        conn.end();
                        if (err) {
                            return reject(err);
                        } else {
                            var reviews = [];
                            for (var i = 0; i < result.length; i++) {
                                var review = new Review();
                                review.rating = result[i].rating;
                                review.comment = result[i].comment;
                                review.createdAt = result[i].createdAt;
                                review.memberName = result[i].memberName;
                                reviews.push(review);
                            }
                            return resolve(reviews);
                        }
                    });
                }
            });
        });
    },

    addReview: function (sku, rating, comment, memberEmail) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                } else {
                    // First get item_id and member_id
                    var sql = 'INSERT INTO reviews (item_id, member_id, rating, comment) ' +
                               'VALUES ((SELECT id FROM itementity WHERE sku = ?), ' +
                               '(SELECT id FROM memberentity WHERE email = ?), ?, ?)';
                    conn.query(sql, [sku, memberEmail, rating, comment], function (err, result) {
                        conn.end();
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve({success: true});
                        }
                    });
                }
            });
        });
    }
};

module.exports = reviewDB;
