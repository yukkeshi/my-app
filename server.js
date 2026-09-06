const http = require('http');
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync('database.db');

const server = http.createServer((req, res) => {
  // CORS対策（どのメソッド・ヘッダーも許可）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ブラウザの事前確認通信（OPTIONS）への対応
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. GET通信（初期値の取得）
  if (req.method === 'GET') {
    const query = db.prepare('SELECT count_value FROM counts ORDER BY id DESC LIMIT 1');
    const latestRow = query.get();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: "データベースから値を取得しました！",
      count: latestRow ? latestRow.count_value : 0
    }));
    return;
  }

  // 2. POST通信（新しいカウント値の保存）
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);

      // 最新のレコードを新しいカウント値でUPDATE
      const updateStmt = db.prepare('UPDATE counts SET count_value = ? WHERE id = (SELECT id FROM counts ORDER BY id DESC LIMIT 1)');
      updateStmt.run(data.newCount);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "DBへの保存が完了しました！" }));
    });
    return;
  }
});

server.listen(3000, () => {
  console.log("サーバー再起動: http://localhost:3000");
});