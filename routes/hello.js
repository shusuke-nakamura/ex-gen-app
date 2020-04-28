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
      res.render('hello', data);
    }
  });

  // 接続の解除
  connection.end();
});

module.exports = router;