// This module stores the parse keys
// It is in .gitignore in order to keep them secret
// You will need to sign up for parse and use your own keys
// Accounts are free at www.parse.com
//
// The keys can be accessed by including the keys module and
// calling KeySvc.key1, KeySvc.key2
angular.module('Keys', [])

.factory('KeySvc', function() {
    return {
        //App Key
        key1:"3VjN8dHXZRpaSZ6TTkxPwx6RxkPX7lpctctsFMTw",
        //JavaScript Key
        key2:"cG3XVQBcdvC2ENO7UTVCqfTBdJA1wtpbD1iK6cdr",
        //REST API Key
        key3:"wk8c5pKnQMR3AY2qHw4kyqfl5uGp4gRJkmCqMetX"
    };
});
