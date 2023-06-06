const MongoClient = require("mongodb");
const { exec } = require('child_process');
const homeDir = require('os').homedir();


const { spawnSync } = require( 'child_process' );

var request = require('request');

const winston =  require('winston');

const { networkInterfaces } = require('os');
const { collection } = require("../models/user.model");

const nets = networkInterfaces();

const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: 'logs/server.log'
        })
    ]
};

const logger = winston.createLogger(logConfiguration);

const uri =
    "mongodb://127.0.0.1:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

// Action Request

exports.actionRequest = (req, res) => {
    res.send('No Action');
}

// End Action Request



/* ************************************* */
/* **********   FACEBOOK     *********** */
/* ************************************* */

/**
 * Returns response containing the dates that the scraper collected data on.
 * @param {Request} req The request object 
 * @param {Response} res Response object for the request
 */
exports.fbUserDates = (req, res) => {  MongoClient.connect(uri, function (err, db) {
    MongoClient.connect(uri, function (err, db) {
        if (err) {
            logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            throw err;
        }
        var dbo = db.db("facebook-data");
        dbo
            .collection("userscollections")
            .find({}, { projection: { users: 0 } })
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
});
}


/**
 * Returns response containing the dates that the scraper collected data on.
 * @param {Request} req The request object which should contain document id the desired date resides on
 * @param {Response} res Response object for the request
 */
exports.fbUserUsers = (req, res) => {
    if (req.params.date_doc_id.length != 24){
        res.send({message:'Invalid document ID!'});
        return;
    }
    MongoClient.connect(uri, function (err, db) {
        if (err) {
               logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
               throw err;
           }
       var dbo = db.db("facebook-data");
       dbo
           .collection("userscollections")
           .findOne(
               { _id: MongoClient.ObjectId(req.params.date_doc_id) },
               { projection: { 'users.posts': 0 } },
               function (err, result) {
                    if (err) {
                        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        throw err;
                    }
                   res.send(result);
                   db.close();
               }
           );
   });
}


/**
 * Returns response containing the dates that the scraper collected data on.
 * @param {Request} req The request object which should contain the the document ID the date resides on and the document ID the user resides on 
 * @param {Response} res Response object for the request
 */
exports.fbUserPosts = (req, res) => {
    MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
               logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
               throw err;
           }
       var dbo = db.db("facebook-data");
       dbo
           .collection("userscollections")
           .findOne(
               { _id: MongoClient.ObjectId(req.params.date_doc_id), 'users._id':MongoClient.ObjectId(req.params.user_doc_id) },
               { projection: {'users.posts.$':1, }},
               function (err, result) {
                    if (err) {
                        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        throw err;
                    }
                   res.send(result);
                   db.close();
               }
           );
   });
}


exports.fbUserAllPosts = (req, res) => {
    MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
               logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
               throw err;
           }
       var dbo = db.db("facebook-data");
       dbo
           .collection("postsofusers")
           .find({}, { projection: { comments: 0 } })
           .toArray()
           .then((items) => {
               res.send(items);
               db.close();
           });
   });
}


/**
 * Returns response containing the dates that the scraper collected data on.
 * @param {Request} req The request object 
 * @param {Response} res Response object for the request
 */
exports.fbPageDates = (req, res) => {  MongoClient.connect(uri, function (err, db) {
    MongoClient.connect(uri, function (err, db) {
        if (err) {
            logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            throw err;
        }
        var dbo = db.db("facebook-data");
        dbo
            .collection("groupscollections")
            .find({}, { projection: { groups: 0 } })
            .toArray()
            .then((items) => {
                res.send(items);
                db.close();
            });
    });
});
}


/**
 * Returns response containing the dates that the scraper collected data on.
 * @param {Request} req The request object which should contain document id the desired date resides on
 * @param {Response} res Response object for the request
 */
exports.fbPagePages = (req, res) => {
    if (req.params.date_doc_id.length != 24){
        res.send({message:'Invalid document ID!'});
        return;
    }
    
    MongoClient.connect(uri, function (err, db) {
        if (err) {
               logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
               throw err;
           }
       var dbo = db.db("facebook-data");
       dbo
           .collection("groupscollections")
           .findOne(
               { _id: MongoClient.ObjectId(req.params.date_doc_id) },
               { projection: { 'groups.posts': 0 } },
               function (err, result) {
                    if (err) {
                        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        throw err;
                    }
                   res.send(result);
                   db.close();
               }
           );
   });
}



/**
 * Returns response containing the dates that the scraper collected data on.
 * @param {Request} req The request object which should contain document id for date and document id for a page/group
 * @param {Response} res Response object for the request
 */
exports.fbPagePosts = (req, res) => {
    MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
               logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
               throw err;
           }
       var dbo = db.db("facebook-data");
       dbo
           .collection("groupscollections")
           .findOne(
               { _id: MongoClient.ObjectId(req.params.date_doc_id), 'groups._id':MongoClient.ObjectId(req.params.page_doc_id) },
               { projection: {'groups.posts.$':1, }},
               function (err, result) {
                    if (err) {
                        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        throw err;
                    }
                   res.send(result);
                   db.close();
               }
           );
   });
}

exports.fbPageAllPosts = (req, res) => {
    MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
               logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
               throw err;
           }
       var dbo = db.db("facebook-data");
       dbo
           .collection("posts")
           .find({}, { projection: { comments: 0 } })
           .toArray()
           .then((items) => {
               res.send(items);
               db.close();
           });
   });
}

/* ************************************* */
/* ********  END FACEBOOK      ********* */
/* ************************************* */




/* ************************************* */
/* **********   TWITTER      *********** */
/* ************************************* */

/**
 * Returns response containing information about the given username if found
 * @param {Request} req The request object which should contain the twitter username
 * @param {Response} res Response object for the request
 */
exports.twitterUserInfo = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) {
            logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            throw err;
        }
        var dbo = db.db("twitter-data");
        dbo
            .collection("twitter")
            .findOne(
                { "UserName": '@' + req.params.username },
                { projection: { tweets: 0 } },
                function (err, result) {
                    if (err) {
                        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        throw err;
                    }
                    res.send(result);
                    db.close();
                }
            );
    });
}

/**
 * Returns all the available users scraped from the twitter platform
 * @param {Request} req A request object
 * @param {Response} res A response object
 */
exports.twitterAllUsers = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) {
            logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            throw err;
        }
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

/**
 * Returns all the available tweets using the specified document ID
 * @param {Request} req A request object containing document id
 * @param {Response} res A response object containing the tweets
 */
exports.twitterTweets = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
        var dbo = db.db("twitter-data");
        dbo
            .collection("twitter")
            .findOne(
                { _id: MongoClient.ObjectId(req.params.doc_id) },
                { projection: { tweets: 1 } },
                function (err, result) {
                     if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                    res.send(result);
                    db.close();
                }
            );
    });
}

/**
 * Performs search based on search parameter in the request object and returns matching posts if any
 * 
 * Search query types: 
 * 
 * Raw alphanumeric string eg. hello : searches posts containing the word hello
 * 
 * Start with @: eg. @username: searches all the posts from the user with usename 'username'
 * 
 * Enclose in quotations: eg. "@username": earches posts containing the word '@username', useful for mentions
 * @param {Request} req A request object contining the search parameter
 * @param {Response} res A response object containing tweets matching the search query
 */
exports.twitterSearch = (req, res) => {
    const sq = req.query.q;
    if (sq == undefined){
        logger.warn(`${500} - ${'Search Query Not Specified'} - - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.send('Search Query Not Specified')
    }
    if (sq[0] === '"' && sq[sq.length - 1] === '"') {
        let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
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
        var lmt = req.query.limit;

        if (req.query.limit == undefined){
            lmt = 3;
        }

        lmt = parseInt(lmt);

        if (!Number.isInteger(lmt)){
            lmt = 3;
        }
        
        MongoClient.connect(uri, function (err, db) {
            if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("twitter-data");
            dbo
                .collection("twitter")
                .find({UserName:sq})
                .sort([['Date_of_Scraping', -1]])
                .limit(lmt)
                .toArray().then((items) => {
                    res.send(items);
                    db.close();
                })
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
            if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
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

                dbo
                .collection("twitter-keyword")
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
                ]).toArray()
                .then((live_items) => {
                    res.send(items.concat(live_items));
                    db.close();
                })

                    
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



/**
 * Used to fetch the scraped telegram channel usersnames with their scraped date
 * @param {Request} req The request object
 * @param {Response} res The response object, containing scraped telegram channel names and their scraping date
 */
exports.telegramChannelAllScraped = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
        if (err) {
            logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            throw err;
        }
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

/**
 * Used to fetch the scraped telegram group usersnames with their scraped date
 * @param {Request} req The request object
 * @param {Response} res The response object, containing scraped telegram group names and their scraping date
 */
exports.telegramGroupAllScraped = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
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

/**
 * Returns telegram posts based on the request type
 * @param {Request} req Request object containing the type of telegram media (channel/group)
 * @param {Response} res Response object containing the telegram posts
 */
exports.telegramPosts = (req, res) => {
    if (req.params.type == 'group') {
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("groups")
                .findOne(
                    { _id: MongoClient.ObjectId(req.params.doc_id) },
                    function (err, result) {
                         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                        res.send(result);
                        db.close();
                    }
                );
        });
    } else if (req.params.type == 'channel') {
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .findOne(
                    { _id: MongoClient.ObjectId(req.params.doc_id) },
                    function (err, result) {
                         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                        res.send(result);
                        db.close();
                    }
                );
        });
    }

};

/**
 * Search scraped telegram channels' posts and returns the post if there is a match
 * @param {Request} req The request object, containing the keyword
 * @param {Rsponse} res The response object
 */
exports.telegramChannelSearch = (req, res) => {
    const sq = req.query.q;
    if (sq[0] === '"' && sq[sq.length - 1] === '"') {
        let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .aggregate([
                    {
                        $project: {
                            data: {
                                $filter: {
                                    input: "$data",
                                    as: "data",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$data.Message",
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
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .findOne({ channel_username: sq.substring(1) },
                    function (err, result) {
                         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .aggregate([
                    {
                        $project: {
                            data: {
                                $filter: {
                                    input: "$data",
                                    as: "data",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$data.Message",
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

/**
 * Search scraped telegram groups' posts and returns the post if there is a match
 * @param {Request} req The request object, containing the keyword
 * @param {Rsponse} res The response object
 */
exports.telegramGroupSearch = (req, res) => {
    const sq = req.query.q;
    if (sq[0] === '"' && sq[sq.length - 1] === '"') {
        let re = new RegExp(".*" + sq.substring(1, sq.length - 1) + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("groups")
                .aggregate([
                    {
                        $project: {
                            group_data: {
                                $filter: {
                                    input: "$group_data",
                                    as: "group_data",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$group_data.Message",
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
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("channels")
                .findOne({ group_username: sq.substring(1) },
                    function (err, result) {
                         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
                        res.send([result]);
                        db.close();
                    });
        });
    } else {
        let re = new RegExp(".*" + sq + ".*", "i");
        MongoClient.connect(uri, function (err, db) {
             if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
            var dbo = db.db("telegram-data");
            dbo
                .collection("groups")
                .aggregate([
                    {
                        $project: {
                            data: {
                                $filter: {
                                    input: "$group_data",
                                    as: "group_data",
                                    cond: {
                                        $regexMatch: {
                                            input: "$$group_data.Message",
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
/* *********  END TELEGRAM      ******** */
/* ************************************* */

/* ************************************* */
/* **********   LINKEDIN      ********** */
/* ************************************* */


/**
 * Returns all the available data on linkedin 
 * @param {Request} req The request object
 * @param {Response} res The response object
 */
exports.linkedinAllScraped = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
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


/**
 * Returns basic info about the videos 
 * @param {Request} req The request object
 * @param {Response} res The response object, containing number of views, number of likes, channel name in whcih the video belongs to, number of subscribers of the channel, if it is being reported and the scraping dates
 */
exports.youtubeAllVideos = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
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

/**
 * Returns all the available scraped comments on a specific youtube video
 * @param {Request} req The request object containing the doc_id
 * @param {Response} res The response object
 */
exports.youtubeComments = (req, res) => {
    MongoClient.connect(uri, function (err, db) {
         if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
        var dbo = db.db("youtube-data");
        dbo
            .collection("youtube")
            .findOne(
                { _id: MongoClient.ObjectId(req.params.doc_id) },
                { projection: { "comments": 1 } },
                function (err, result) {
                     if (err) {
                logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                throw err;
            }
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
//              if (err) {
                // logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                // throw err;
            // }
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
//              if (err) {
            //     logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            //     throw err;
            // }
//             var dbo = db.db("twitter-data");
//             dbo
//                 .collection("twitter")
//                 .findOne({ UserName: sq },
//                     function (err, result) {
//                          if (err) {
            //     logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            //     throw err;
            // }
//                         res.send([result]);
//                         db.close();
//                     });
//         });
//     } else {
//         let re = new RegExp(".*" + sq + ".*", "i");
//         MongoClient.connect(uri, function (err, db) {
//              if (err) {
            //     logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            //     throw err;
            // }
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
 
/**
 * Used by devs to execute command by sending request
 */
class os_func {
    constructor() {
        this.execCommand = function (cmd) {
            return new Promise((resolve, reject) => {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(stdout);
                });
            });
        };
    }
}


/**
 * Performs live search for posts containing the specified search query from all platforms
 * @param {Request} req The request object containing the search query 
 * @param {Response} res The response object to contian the matched results
 */
exports.twitterLiveSearch = (req, res) => {

    const keywordScript = homeDir + '/Desktop/osint/Twitter/twitter-scraper/Scraper/index_keyword_new.py'
    const usernameScript = homeDir + '/Desktop/osint/Twitter/twitter-scraper/Scraper/index_new.py'
    const filterAccountScript = homeDir + '/Desktop/osint/Twitter/twitter-scraper/Scraper/filter_account.py'
   
    var type = req.body.type;
    var query = '';
    var scriptPath = '';
    var collectionName = '';

    if (type == undefined){
        res.send({
            "status" : "failed",
            "message": "Type is required!",
            "data" : []
        });
        return;
    } else if (type == 'keyword'){
        query = req.body.keyword;
        scriptPath = keywordScript;
        collectionName = 'keyword';
    }else if (type == 'username'){
        query = req.body.keyword;
        scriptPath = usernameScript;
        collectionName = 'twitter';
    }else if (type == 'name'){
        query = req.body.name;
        scriptPath = filterAccountScript;
        collectionName = 'account_info';
    }else{
        res.send({
            "status" : "failed",
            "message": "Invalid Type!",
            "data" : []
        });
        return;
    }
 
    var startTimestamp = new Date();
    startTimestamp.setTime(startTimestamp.getTime()+3*3600*1000);
    var os = new os_func();

    // os.execCommand('ls').then(resp=> {
        os.execCommand('/usr/bin/python3 '+scriptPath+' "'+query+'"').then(res=> {
            MongoClient.connect(uri, function (err, db) {
                if (err) {
                    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                    throw err;
                }
                var dbo = db.db("twitter-data");
                dbo
                    .collection(collectionName)
                    .find({ Date_of_Scraping: {$gt : startTimestamp}})
                    .toArray()
                    .then((items) => {
                        res.send(items);
                        db.close();
                    });
            });
    }).catch(err=> {
        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.send([])
    })

    
    
};

/**
 * Initiates the facebook live search and returns the response when it'd done
 * @param {Request} req The request object containing the search query
 * @param {Response} res The response object
 */
exports.facebookLiveSearch = (req, res) => {
    var query = req.body.q;
    var type = req.body.type;

    if (type == 'name'){
        request({
            url: 'http://127.0.0.1:3255/api/get-users',
            method: "POST",
            json: true,
            body: {"id":query}
        }, function (error, response, body){
            if (error){
                logger.error(`${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            }
            
            res.send(response);
        });

        // res.send({
        //     status: "success", 
        //     data: [
        //         {
        //             name: "Getachew Assefa",
        //             info: "14K followers",
        //             profile_link : "https://www.facebook.com/getachew.UMDMedia"
        //         },
        //         {
        //             name: "Getachew Asefa",
        //             info: "Works at University of Toronto · University of Toronto · Lives in Toronto, Ontario",
        //             profile_link : "https://www.facebook.com/getachew.asefa.14473"
        //         },
        //         {
        //             name: "Getachew Assefa",
        //             info: "Addis Ababa University · Lives in Addis Ababa, Ethiopia · 34 followers",
        //             profile_link : "https://www.facebook.com/getachew.assefa.756"
        //         },
        //     ]
        // })
    }else if (type == 'user-id'){
        res.send({'message':'not supported yet!'})
    }else if (type == 'keyword'){
        request({
            url: 'http://127.0.0.1:3555/api/post',
            method: "POST",
            json: true,
            body: {"id":query}
        }, function (error, response, body){
            if (error){
                logger.error(`${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            }
            res.send(response);
        });
    }else if (type == undefined){
        res.send({
            "status" : "failed",
            "message": "Type is required!",
            "data" : []
        });
    }else{
        res.send({
            "status" : "failed",
            "message": "Invalid Type!",
            "data" : []
        });
    }

    // const results = Object.create(null);

    // for (const name of Object.keys(nets)) {
    //     for (const net of nets[name]) {
    //         // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    //         // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
    //         const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
    //         if (net.family === familyV4Value && !net.internal) {
    //             if (!results[name]) {
    //                 results[name] = [];
    //             }
    //             results[name].push(net.address);
    //         }
    //     }
    // }

    // var _ip = results["ens192"];
    // if (_ip == undefined){
    //     _ip = results["en0"];
    // }
    // // _ip = _ip[0];

    // request({
    //     url: 'http://127.0.0.1:3555/api/post',
    //     method: "POST",
    //     json: true,
    //     body: {"id":query}
    // }, function (error, response, body){
    //     if (error){
    //         logger.error(`${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    //     }
        
    //     res.send(response);
    // });
};





/* ************************************* */
/* ************  COMMON     ************ */
/* ************************************* */