const box = require("../models/box");
const cinema = require("../models/cinema");

const   middlewareObj      = {};

// middlewareObj.checkboxOwner = function(req, res, next){
//     if(req.isAuthenticated()){
//         box.findById(req.params.id, function(err, foundbox) {
//             if(err){
//                 res.redirect('back'); 
//             }else{
//                 if(foundbox.author.id.equals(req.user._id)) {
//                     next();
//                 }else{
//                     req.flash('error','You do not have permission to do this action.');
//                     res.redirect('back');
//                 }
//             }
//         });
//     }else{
//         req.flash('error','You need to login first');
//         res.redirect('/login'); 
//     }
// }

middlewareObj.isloggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error','You need to login first');
    res.redirect('/login');
}

module.exports = middlewareObj;