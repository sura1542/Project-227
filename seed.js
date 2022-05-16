const   mongoose    =   require('mongoose'),
        Box         =   require('./models/box'),
        Comment     =   require('./models/comment');

// const data = [
//     {
//         name:'Aris',
//         url: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/movie-poster-template-design-630d9d1e6c7be72d25bec9a52accc428_screen.jpg?ts=1636999242'
//     }
// ];

function seeddb() {
    Box.remove({}, function(err) {
        if (err) {
            console.error(err)
        }else {
            console.log('Data removed complete');
            
            // data.forEach(function(seed){
            //     Box.create(seed, function(err, box) {
            //         if (err) {
            //             console.log(err);
            //         }else {
            //             console.log('new data added successfully');
            //             Comment.create({
            //                 author: 'Aris',
            //                 text: 'It is funny'
            //             }, function(err, comment) {
            //                 if (err) {
            //                     console.log(err)
            //                 }else {
            //                     box.comments.push(comment);
            //                     box.save();
            //                 }
            //             });
            //         }
            //     });
            // });
        }
    });
}

module.exports = seeddb;