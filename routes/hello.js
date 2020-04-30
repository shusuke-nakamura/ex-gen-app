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

var knex = require('knex')({
  dialect: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'my-nodeapp-db',
    charset: 'utf8'
  }
});

var Bookshelf = require('bookshelf')(knex);

var MyData = Bookshelf.Model.extend({
  tableName: 'mydata'
});

const { check, validationResult } = require('express-validator');

router.get('/', (req, res, next) => {
  new MyData().fetchAll().then((collection) => {
    var data = {
      title: 'Hello',
      content: collection.toArray()
    };
    res.render('hello/index', data);
  }).catch((err) => {
    res.status(500).json({ error: true, data: { message: err.message } });
  });
 });

// 新規登録ページへのアクセス
router.get('/add', (req, res, next) => {
  var data = {
    title: 'Hello/Add',
    content: '新しいレコードを入力:',
    form: {name: '', mail: '', age: 0}
  };
  res.render('hello/add', data);
});

// 新規作成フォームの送信の処理
router.post('/add', validateParam(), (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var re = '<ul class="error">';
    var result_arr = errors.array();
    for (var n in result_arr) {
      re += '<li>' + result_arr[n].msg + '</li>';
    }
    re += '</ul>';
    var data = {
      title: 'Hello/Add',
      content: re,
      form: req.body
    };
    res.render('hello/add', data);
  } else {
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
  }
});

// 入力チェックの定義
function validateParam() {
  return [
    check('name').notEmpty().withMessage('NAME は必ず入力して下さい。'),
    check('mail').isEmail().withMessage('MAIL はメールアドレスを記入して下さい。'),
    check('age').isInt().withMessage('AGE は年齢(整数)を入力して下さい。')
  ];
}

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

// 指定レコードの表示
router.get('/edit', (req, res, next) => {
  var id = req.query.id;

  var connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query('SELECT * FROM mydata WHERE id = ?', id, function (error, results, fields) {
    if (error == null) {
      var data = {
        title: 'Hello/edit',
        content: 'id = ' + id + ' のレコード:',
        mydata: results[0]
      }
      res.render('hello/edit', data);
    }
  });
  connection.end();
});

// 編集フォーム送信の処理
router.post('/edit', (req, res, next) => {
  var id = req.body.id;
  var nm = req.body.name;
  var ml = req.body.mail;
  var ag = req.body.age;
  var data = { 'name': nm, 'mail': ml, 'age': ag };

  var connection = mysql.createConnection(mysql_setting);
  connection.connect();

  connection.query('UPDATE mydata set ? WHERE id = ?', [data, id], function (error, results, fields) {
    res.redirect('/hello');
  });

  connection.end();
});

// 指定レコードの削除
router.get('/delete', (req, res, next) => {
  var id = req.query.id;

  var connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query('SELECT * FROM mydata WHERE id = ?', id, function (error, results, fields) {
    if (error == null) {
      var data = {
        title: 'Hello/delete',
        content: 'id = ' + id + ' のレコード:',
        mydata: results[0]
      }
      res.render('hello/delete', data);
    }
  });
  connection.end();
});

// 削除フォーム送信の処理
router.post('/delete', (req, res, next) => {
  var id = req.body.id;

  var connection = mysql.createConnection(mysql_setting);
  connection.connect();

  connection.query('DELETE FROM mydata WHERE id = ?', id, function (error, results, fields) {
    res.redirect('/hello');
  });

  connection.end();
});


module.exports = router;