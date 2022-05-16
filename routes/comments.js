const   express = require('express'),
        router  =  express.Router(),
        box    = require('../models/box'),
        Comment    = require('../models/comment');

        router.post("/", function(req, res) {
    box.findById(req.params.id, function(err,foundbox){
        if (err) {
            console.log(err);
        }else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                }else {
                    foundbox.comments.push(comment);
                    foundbox.save();
                    res.redirect('/prints/'+ req.params.id);
                }
            });
        }
    
    });
});

router.get("/new", function(req, res) {
    box.findById(req.params.id, function(err, foundbox) {
        if (err) {
            console.log(err);
        }else {
            res.render("new.ejs", {box: foundbox});
        }
    });
});

module.export = router;