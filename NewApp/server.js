const express = require('express');
const app = express();
var Parse = require('parse/node');
const path = require('path');
const bodyParser = require('body-parser');

//var key1 = "3VjN8dHXZRpaSZ6TTkxPwx6RxkPX7lpctctsFMTw";
//var key2 = "cG3XVQBcdvC2ENO7UTVCqfTBdJA1wtpbD1iK6cdr";
//var key3 = "wk8c5pKnQMR3AY2qHw4kyqfl5uGp4gRJkmCqMetX";
//var server_id_token = null;
//// key 4 IxQ6WCASSDqb3nGMwplG
//Parse.initialize(key1, key2);
//Parse.serverURL = 'https://parseapi.back4app.com';
//Parse.User.logIn("3e", "IxQ6WCASSDqb3nGMwplG", {
//    success: function (_user) {
//        user = _user;
//        console.log(user.get('username'));
//        success = true;
//        server_id_token = user.getSessionToken();
//        console.log("check")
//        console.log(server_id_token);
//    },
//    error: function (user, error) {
//        // The login failed. Check error to see why
//        success = false;
//        msg = error.message;
//        console.log(msg);
//    }
//});

//console.log(Parse.User.current());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static("public"));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

//LOGIN
//app.use('/login', function (req, res, next) {
//    Parse.User.logIn(req.body.username, req.body.password, {
//        success: function (_user) {
//            user = _user;
//            console.log(user.get('username'));
//            res.success = true;
//            res.user_session = user.getSessionToken();
//            console.log("check")
//            console.log(Parse.User.current());
//            next();
//        },
//        error: function (user, error) {
//            // The login failed. Check error to see why
//            res.success = false;
//            res.msg = error.message;
//            next();
//        }
//    });

//})

//app.post('/login', function (req, res) {
//    console.log(res.success);
//    res.send({ success: res.success, user_session: res.user_session });
//})




app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})




