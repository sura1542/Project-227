const   express = require('express'),
        router  =  express.Router(),
        User    = require('../models/user'),
        passport = require('passport');


router.get('/show', function(req, res){
    res.render('show.ejs');
})

router.get("/", function(req, res) {
    res.render("landing.ejs");
});

router.get("/index", function(req, res) {
    res.render("index.ejs");
    res.render('index.ejs', { link: "profile.ejs" });
})

router.get("/cinema", function(req, res) {
    res.render("cinema.ejs");
});

router.get("/movie", function(req, res) {
    res.render("movie.ejs");
});

router.get("/profile", function(req, res) {
    res.render("profile.ejs");
});

router.get("/register", function(req, res) {
    res.render("register.ejs");
});

router.post("/register", function(req, res) {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect("/register");
        }else {
                passport.authenticate('local')(req, res, function(){
                res.redirect('/prints');;
            });
        }
    });
});



router.get("/login", function(req, res) {
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: '/prints',
        failureRedirect: '/login'
    }), function(req, res){

});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get("/seat", function(req, res) {
    res.render("seat.ejs");
});

router.get("/ctime", function(req, res) {
    res.render("ctime.ejs");
});

module.exports = router;