var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  // var name = req.query.name;
  // var mail = req.query.mail;
  var msg = "※何か書いて送信して下さい。";
  if (req.session.message != undefined) {
    msg = "Last Message: " + req.session.message;
  }
  var data = {
    title: 'Hello!',
    // content: 'あなたの名前は、' + name + '。<br>' + 'メールアドレスは、' + mail + 'です。'
    content: msg
  };
  res.render('hello', data);
});

router.post('/post', (req, res, next) => {
  var msg = req.body['message'];
  req.session.message = msg;
  var data = {
    title: 'Hello!',
    content: "Last Message: " + req.session.message
  };
  res.render('hello', data);
});

module.exports = router;