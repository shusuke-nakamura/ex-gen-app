var express = require('express');
var router = express.Router();

var mysql = require('mysql');

// MySQLの設定情報
var mysql_setting = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'my-nodeapp-db'
};

router.get('/', (req, res, next) => {

  // コネクションの用意
  var connection = mysql.createConnection(mysql_setting);

  // データベースに接続
  connection.connect();

  // データを取り出す
  connection.query('SELECT * FROM mydata', function (error, results, fields) { 
    // データベースアクセス完了時の処理
    if (error == null) {
      var data = { title: 'mysql', content: results };
      res.render('hello/index', data);
    }
  });

  // 接続の解除
  connection.end();
});

// 新規登録ページへのアクセス
router.get('/add', (req, res, next) => {
  var data = {
    title: 'Hello/Add',
    content: '新しいレコードを入力:'
  };
  res.render('hello/add', data);
});

// 新規作成フォームの送信の処理
router.post('/add', (req, res, next) => {
  var nm = req.body.name;
  var ml = req.body.mail;
  var age = req.body.age;

  var data = { 'name': nm, 'mail': ml, 'age': age };

  var connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query('INSERT INTO mydata set ?', data, function (error, results, fields) {
    res.redirect('/hello');
  });

  connection.end();
});

router.get('/show', (req, res, next) => {
  var id = req.query.id;
  var connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query('SELECT * FROM mydata where id=?', id, function (error, results, fields) {
    if (error == null) {
      var data = {
        title: 'Hello/show',
        content: 'id = ' + id + ' のレコード:',
        mydata: results[0]
      };
      res.render('hello/show', data);
    }
  });
  connection.end();
});

module.exports = router;