const   express = require('express'),
        router  =  express.Router(),
        box    = require('../models/box');


router.get("/", function(req, res) {
    box.find({},function(err, allbox) {
        if (err) {
            console.log(err);
        }else {
             res.render("index.ejs",{prints:allbox});
        }
    });
   
});

router.get("/:id", function(req, res){
    box.findById(req.params.id).populate('comments').exec(function(err,foundbox){
        if (err) {
            console.log(err);
        }else{
            res.render('show.ejs', {box:foundbox});
        }
    });
});

// router.get("/new", function(req, res) {
//     box.findById(req.params.id, function(err, foundbox) {
//         if (err) {
//             console.log(err);
//         }else {
//             res.render("new.ejs", {box: foundbox});
//         }
//     });
// });

module.exports = router;