const jwt = require('jsonwebtoken')

var data = {
    email:"nishchitpatel84@gmail.com",
    id:1000
}
var token = jwt.sign(
    data,
    "hello"
    ,{
        expiresIn:'1h'
    }
);

console.log(token);

var decode = jwt.verify(token,"hello");

console.log(decode)