
const MongoClient = require("mongodb");
const uri =
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";





// Action Request

exports.actionRequest = (req, res) => {
    res.send('No Action');

    // MongoClient.connect(uri, function (err, db) {
    //     if (err) throw err;
    //     var dbo = db.db("twitter-data");


    //     for (var i = 0; i < 200; i++) {
    //         var newVal = {};
    //         newVal[`tweets.${i.toString()}.reporting`] = {
    //             "is_reported": null,
    //             "reporting_date": null,
    //             "reported_by": null,
    //             "report_count": 0
    //         };
    //         try {
    //             dbo
    //                 .collection("twitter")
    //                 .updateMany(
    //                     {},
    //                     {
    //                         '$set': newVal
    //                     },
    //                     function (err, result) {
    //                         if (err) throw err;
    //                         res.send('OK');
    //                         db.close();
    //                     }
    //                 )
    //         } catch (e) {

    //         }

    //     }

    // });


}

// End Action Request



/* ************************************* */
/* **********   TWITTER      *********** */
/* ************************************* */

exports.twitterUserInfo = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("twitter-data");
        dbo
            .collection("twitter")
            .findOne(
                { "UserName": '@' + req.params.username },
                { projection: { tweets: 0 } },
                function (err, result) {
                    if (err) throw err;
                    res.send(result);
                    db.close();
                }
            );
    });
}

exports.twitterAllUsers = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("twitter-data");
        dbo
            .collection("twitter")
            .find({}, { projection: { tweets: 0 } })
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
}

exports.twitterTweets = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("twitter-data");
        dbo
            .collection("twitter")
            .findOne(
                { _id: MongoClient.ObjectId(req.params.doc_id) },
                { projection: { tweets: 1 } },
                function (err, result) {
                    if (err) throw err;
                    res.send(result);
                    db.close();
                }
            );
    });
}

exports.twitterSearch = (req, res) => {
    const sq = req.query.q;
    if (sq[0] === '"' && sq[sq.length - 1] === '"') {
        let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .aggregate([
                    {
                        $project: {
                            tweets: {
                                $filter: {
                                    input: "$tweets",
                                    as: "tweets",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$tweets.tweet",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    } else if (sq.startsWith("@")) {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .findOne({ UserName: sq },
                    function (err, result) {
                        if (err) throw err;
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .aggregate([
                    {
                        $project: {
                            tweets: {
                                $filter: {
                                    input: "$tweets",
                                    as: "tweets",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$tweets.tweet",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    }
};

/* ************************************* */
/* *********  END TWITTER      ********* */
/* ************************************* */


/* ************************************* */
/* **********   TELEGRAM      ********** */
/* ************************************* */


exports.telegramChannelAllScraped = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("telegram-data");
        dbo
            .collection("channels")
            .find({}, { projection: { data: 0 } })
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
};


exports.telegramGroupAllScraped = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("telegram-data");
        dbo
            .collection("groups")
            .find({}, { projection: { group_data: 0 } })
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
};



exports.telegramPosts = (req, res) => {
    console.log('telegram posts requested');
    console.log(req.params.type);
    console.log(req.params.doc_id);
    if (req.params.type == 'group') {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("telegram-data");
            dbo
                .collection("groups")
                .findOne(
                    { _id: MongoClient.ObjectId(req.params.doc_id) },
                    function (err, result) {
                        if (err) throw err;
                        res.send(result);
                        db.close();
                    }
                );
        });
    } else if (req.params.type == 'channel') {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .findOne(
                    { _id: MongoClient.ObjectId(req.params.doc_id) },
                    function (err, result) {
                        if (err) throw err;
                        res.send(result);
                        db.close();
                    }
                );
        });
    }

};


/* ************************************* */
/* *********  END TELEGRAM      ******** */
/* ************************************* */

/* ************************************* */
/* **********   LINKEDIN      ********** */
/* ************************************* */



exports.linkedinAllScraped = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("linkedin-data");
        dbo
            .collection("profile")
            .find({})
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
};


/* ************************************* */
/* *********  END LINKEDIN      ******** */
/* ************************************* */




/* ************************************* */
/* **********   YOUTUBE      *********** */
/* ************************************* */

exports.youtubeAllVideos = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("youtube-data");
        dbo
            .collection("youtube")
            .find({}, { projection: { 'comments': 0, comment: 0 } })
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
}

exports.youtubeComments = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("youtube-data");
        dbo
            .collection("youtube")
            .findOne(
                { _id: MongoClient.ObjectId(req.params.doc_id) },
                { projection: { "comments": 1 } },
                function (err, result) {
                    if (err) throw err;
                    res.send(result);
                    db.close();
                }
            );
    });
}

// exports.youtubeSearch = (req, res) => {
//     const sq = req.query.q;
//     if (sq[0] === '"' && sq[sq.length - 1] === '"') {
//         let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
//         MongoClient.connect(uri, function (err, db) {
//             if (err) throw err;
//             var dbo = db.db("twitter-data");
//             dbo
//                 .collection("twitter")
//                 .aggregate([
//                     {
//                         $project: {
//                             tweets: {
//                                 $filter: {
//                                     input: "$tweets",
//                                     as: "tweets",
//                                     cond: {
//                                         $regexMatch: {
//                                             input: "$$tweets.tweet",
//                                             regex: re,
//                                         },
//                                     },
//                                 },
//                             },
//                             // Fullname: 1,
//                             // UserName: 1,
//                         },
//                     },
//                 ])
//                 .toArray()
//                 .then((items) => {
//                     res.send(items);
//                     db.close();
//                 });
//         });
//     } else if (sq.startsWith("@")) {
//         MongoClient.connect(uri, function (err, db) {
//             if (err) throw err;
//             var dbo = db.db("twitter-data");
//             dbo
//                 .collection("twitter")
//                 .findOne({ UserName: sq },
//                     function (err, result) {
//                         if (err) throw err;
//                         res.send([result]);
//                         db.close();
//                     });
//         });
//     } else {
//         let re = new RegExp(".*" + sq + ".*", "i");
//         MongoClient.connect(uri, function (err, db) {
//             if (err) throw err;
//             var dbo = db.db("twitter-data");
//             dbo
//                 .collection("twitter")
//                 .aggregate([
//                     {
//                         $project: {
//                             tweets: {
//                                 $filter: {
//                                     input: "$tweets",
//                                     as: "tweets",
//                                     cond: {
//                                         $regexMatch: {
//                                             input: "$$tweets.tweet",
//                                             regex: re,
//                                         },
//                                     },
//                                 },
//                             },
//                             // Fullname: 1,
//                             // UserName: 1,
//                         },
//                     },
//                 ])
//                 .toArray()
//                 .then((items) => {
//                     res.send(items);
//                     db.close();
//                 });
//         });
//     }
// };

/* ************************************* */
/* *********  END YOUTUBE      ********* */
/* ************************************* */





/* ************************************* */
/* ************  COMMON     ************ */
/* ************************************* */
 
exports.globalKeywordSearch = (req, res) => {
    const sq = req.query.q;
    if (sq[0] === '"' && sq[sq.length - 1] === '"') {
        let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .aggregate([
                    {
                        $project: {
                            tweets: {
                                $filter: {
                                    input: "$tweets",
                                    as: "tweets",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$tweets.tweet",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    } else if (sq.startsWith("@")) {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .findOne({ UserName: sq },
                    function (err, result) {
                        if (err) throw err;
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .aggregate([
                    {
                        $project: {
                            tweets: {
                                $filter: {
                                    input: "$tweets",
                                    as: "tweets",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$tweets.tweet",
                                            regex: re,
                                        },
                                    },
                                },
                            },
                            // Fullname: 1,
                            // UserName: 1,
                        },
                    },
                ])
                .toArray()
                .then((items) => {
                    res.send(items);
                    db.close();
                });
        });
    }
};




/* ************************************* */
/* ************  COMMON     ************ */
/* ************************************* */