const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose');
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        User            = require('./models/user'),
        box             = require('./models/box'),
        Comment         = require('./models/comment'),
        flash           = require('connect-flash'),
        middleware      = require('./middleware'),
        seat            = require('./models/seat'),
        cinema          = require('./models/cinema'),
        methodOverride  = require('method-Override'),
        ticket          = require('./models/ticket'),
        seeddb          = require('./seed.js');


// const   indexRoutes     = require('./routes/index'),
//         boxRoutes       = require('./routes/box'),
//         commentsRoutes  = require('./routes/comments');

mongoose.connect('mongodb://localhost:/DDCinema'),
app.set("veiw engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extend: true}));
app.use(methodOverride('_method'));
app.use(flash());
// seeddb();


app.use(require("express-session")({
    secret: 'secret word',
    resave: false,
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

const loginSchema = new mongoose.Schema({
    name: String,
    Email: String,
    Password: String
});

const login = mongoose.model('login',loginSchema);


app.get('/show', function(req, res){
    res.render('show.ejs');
})
app.post("/show", passport.authenticate('local',
    {
        successRedirect: '/seat',
        failureRedirect: '/show'
    }), function(req, res){
});

app.get("/", function(req, res) {
    res.render("landing.ejs");
});

app.get("/prints", function(req, res) {
    box.find({},function(err, allbox) {
        if (err) {
            console.log(err);
        }else {
            cinema.find({},function(err, allcinema) {
                if (err) {
                    console.log(err);
                }else {
                    res.render("index.ejs",{prints:allbox, cinema:allcinema});
                }
            });
            
        }
    });
   
});

app.get("/movie", function(req, res) {
    let surawee = req.query.cinemaname;
    box.find({},function(err, allbox) {
        if (err) {
            console.log(err);
        }else {
            cinema.findOne().where('cinemaname').equals(surawee).exec(function(err, foundcinema) {
                if (err) {
                    console.log(err);
                }else {
                    res.render("movie.ejs",{movie:allbox, cinema:foundcinema});
                }
            }
        )}
    });
   
});



app.post("/prints", function(req, res) {
    let name = req.body.box.name;
    let url = req.body.box.url;
    let description = req.body.box.description;
    let video = req.body.box.video;
    let timeonair = req.body.box.timeonair;
    let newbox = {name:name, url:url, description:description,video:video, timeonair:timeonair};
    box.create(newbox, function(err, allbox){

        if (err) {
            console.log(err);
        }else{
            res.redirect("/prints");
        }
    });
});

app.get("/prints/add",middleware.isloggedIn, function(req, res){
    res.render("add.ejs");
});

app.get("/index", function(req, res) {
    res.render("index.ejs");
    res.render('index.ejs', { link: "profile.ejs" });
})


app.post("/cinema", function(req, res){
    let cinemaname = req.body.cinemaname;
    let newcinema = {cinemaname:cinemaname};
    cinema.create(newcinema, function(err, allcinema){
        if(err){
            console.log(err);
        }else{
            res.redirect("/cinema");
        }
    });
});

app.get("/cinema", function(req, res) {
    res.render("cinema.ejs", {cinema:cinema});
});


// app.get("/profile", function(req, res) {
//     res.render("profile.ejs");
// });

app.post("/profile", function(req, res) {
    let username = req.params.username;
    let firstname = req.params.firstname;
    let lastname = req.params.lastname;
    let email = req.params.email;
    let profileImage = req.params.profileImage;
    let newprofile = {username:username, firstname:firstname, lastname:lastname, email:email, profileImage:profileImage};
    profile.create(newprofile, function(err, profile) {
        if (err) {
            console.log(err);
        }else {
            res.redirect("/profile");
        }
    });
});

app.get("/user/:id", function(req, res) {
    User.findById(req.params.id).populate("ticket").exec( function(err, user) {
        if (err) {
            req.flash('error', 'There is something wrong ');
            return res.redirect('/');
        }else{
            ticket.find({_id: {$in:user.ticket}}).populate("box cinema seat").exec( function(err, foundticket) {
                if (err) {
                    console.log(err);
                }else {
                    res.render('profile.ejs', {user: user, ticket: foundticket});
                }
            })
            
        }
    });
});

app.get("/register", function(req, res) {
    res.render("register.ejs");
});

app.post("/register", function(req, res) {
    let newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email});
        // profileImage: req.body.profileImage});
    if (req.body.adminCode === 'topsecret' ){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect("/register");
        }else {
                passport.authenticate('local')(req, res, function(){
                res.redirect('/prints');
            });
        }
    });
});



app.get("/login", function(req, res) {
    res.render("login.ejs");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: '/prints',
        failureRedirect: '/login',
        successFlash: 'true',
        failureFlash: 'true',
        successFlash: 'Login Successfully',
        failureFlash: 'Invalid username or password'
    }), function(req, res){

});
app.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'Log out successfully');
    res.redirect('/prints');
});


app.post("/index", passport.authenticate("local",
    {
        successRedirect: '/moive',
        failureRedirect: '/index'
    }), function(req, res){
});


app.post("/seat", function(req, res){
    let rowNumber = req.body.rowNumber;
    let newseat = { rowNumber: rowNumber};
    seat.create(newseat, function(err, foundseat) {
        if (err) {
            console.log(err);
        }else {
            res.redirect("/seat");
        }
    });

});

app.get("/seat", middleware.isloggedIn,function(req, res){
    seat.find({}, function(err, foundseat){
        if(err) {
            console.error(err);
        }else{
            res.render('seat.ejs', {seat: foundseat});
            console.log(foundseat);
        }
    })
})


app.get("/box/:id/cinema/:cinema_id/seat", function(req, res) {
    box.findById(req.params.id).populate('comments').exec(function(err,foundbox){
        if (err) {
            console.log(err);
        }else{
            cinema.findById(req.params.cinema_id, function(err, foundcinema){
                if (err) {
                    console.log(err);
                }else{
                    seat.find({}, function(err, foundseat){
                        if (err) {
                            console.log(err);
                        }else{
                            res.render('seat.ejs', {box:foundbox, cinema:foundcinema, seat: foundseat}); 
                        }
                    });
                   
                }
            });
        }
    });
});

app.post("/box/:id/cinema/:cinema_id/seat", function(req, res) {
    let Seat = req.body.seat_id;
    
    box.findById(req.params.id).populate('comments').exec(function(err,foundbox){
        if (err) {
            console.log(err);
        }else{
            cinema.findById(req.params.cinema_id, function(err, foundcinema){
                if (err) {
                    console.log(err);
                }else{
                    seat.findById(Seat, function(err, foundseat){
                        if (err) {
                            console.log(err);
                        }else{
                            User.findById(req.user._id, function(err, founduser){
                                if (err) {
                                    console.log(err);
                                }else{
                                    let data = {
                                        box: foundbox,
                                        cinema: foundcinema,
                                        seat: foundseat
                                    }
                                    ticket.create(data, function(err, ticket){
                                        if (err) {
                                            console.log(err);
                                        }else{
                                            founduser.ticket.push(ticket);
                                            founduser.save();
                                            res.redirect('/user/'+ founduser._id);
                                        }
                                    });
                                }
                            });
                        }
                    });
                   
                }
            });
        }
    });
});

app.get("/ctime", function(req, res) {
    res.render("ctime.ejs");
});

app.post("/login", passport.authenticate('local',{
    successRedirect: '/print',
    failureRedirect: '/login'
}), function(req, res){
});

app.get('/logout', function(req, res){
    res.logout();
    res.redirect('/');
});

app.get("/box/:id", function(req, res){
    box.findById(req.params.id).populate('comments').exec(function(err,foundbox){
        if (err) {
            console.log(err);
        }else{
            cinema.find({}, function(err, foundcinema){
                if (err) {
                    console.log(err);
                }else{
                    let date = new Date();
                   res.render('show.ejs', {box:foundbox, cinema:foundcinema, date:date}); 
                }
            })
            
        }
    });
});

app.get("/box/:id/cinema/:cinema_id", function(req, res){
    box.findById(req.params.id).populate('comments').exec(function(err,foundbox){
        if (err) {
            console.log(err);
        }else{
            cinema.findById(req.params.cinema_id, function(err, foundcinema){
                if (err) {
                    console.log(err);
                }else{
                let date = new Date()
                console.log(date);
                res.render('show.ejs', {box:foundbox, cinema:foundcinema, date:date}); 
                }
            })
        }
    });
});


app.get("/box/:id/new", middleware.isloggedIn ,function(req, res) {
    let newDate = new Date(req.params.id);
    console.log(newDate);
    box.findById(req.params.id, function(err, foundbox) {
        if (err) {
            console.log(err);
        }else {
            console.log(foundbox);
            res.render("new.ejs", {box: foundbox});
        }
    });
});

app.post("/box/:id/comments", function(req, res) {
    box.findById(req.params.id, function(err,foundbox){
        if (err) {
            console.log(err);
        }else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                }else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundbox.comments.push(comment);
                    foundbox.save();
                    res.redirect('/box/'+ foundbox._id);
                }
            });
        }
    
    });
});

app.get("/box/:id/edit", function(req, res) {
    box.findById(req.params.id, function(err, foundbox){
        if(err) {
            console.log(err);
        }else{
            res.render('edit.ejs',{box: foundbox})
        }
    });
});



app.put('/box/:id', function(req, res){
    box.findByIdAndUpdate(req.params.id, req.body.box, function(err, updatedbox){
        if(err){
            console.log(err);
            res.redirect('/prints/');
        }else{
            res.redirect('/prints/');
        }
    });
});

app.delete('/box/:id', function(req, res){
    box.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            console.log(err);
            res.redirect('/prints/');
        }else{
            res.redirect('/prints/');
        }
    });
});

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

function isloggedin(req, res, next) {
    if (req.isAuthenticated) {
        return next();
    }else {
        res.redirect('/login');
    }
}

app.get("/movie/all", function(req, res) {
    box.find({}, function(err, foundshow) {
        if (err) {
            console.log(err);
        }else{
           res.render('showmovie.ejs', {box: foundshow});
        
        }
    })
    
})

app.get("/cinema/all", function(req, res){
    cinema.find({}, function(err, foundcinema){
        if(err){
            console.log(err);
        }else{
            res.render('showcinema.ejs', {cinema: foundcinema});
        }
    });
});


app.get('/movie/sortBydate', function(req, res){
    box.find({}, function(err, movieLists){
        if(err){
            req.flash('error', err.message);;
            res.redirect('/');
        }else{
            movieLists.sort((a, b) => (a.date > b.date) ? 1 : -1);
            res.render('sort.ejs', {prints: movieLists});
        }
    });
});

app.post('/word', function(req, res){
    console.log("dsadas")
    let word = req.body.word;
    box.find({name :{$regex : word, $options :"i"}}).exec(function(err, allbox){
        if(err){
            console.log(err);
        }
        else{
            cinema.find({},function(err, allcinema) {
                if (err) {
                    console.log(err);
                }else {
                    res.render("index.ejs",{prints: allbox, cinema:allcinema});
                }
            });
        }
    });
});


// app.get("/prints/add", function(req, res){
//     res.render("add.ejs");
// });

// app.use('/', indexRoutes);
// app.use('/box', boxRoutes);
// app.use('/box/:id/comments', commentsRoutes);

// app.use(function(req, res, next) {
//     res.locals.error = req.flash('error');
//     res.locals.success = req.flash('success');
//     next();
// })


app.listen(5000,function(){
    console.log("Activated");
});