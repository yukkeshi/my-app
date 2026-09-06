let count = 0;

const text = document.getElementById("count-text");
const button = document.getElementById("count-btn");
const msgElement = document.getElementById("server-message");

// サーバー（DB）から初期カウントを取得
fetch("http://localhost:3000")
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    msgElement.textContent = data.message;
    count = data.count;
    text.textContent = "現在のカウント: " + count;
  })
  .catch(function(err) {
    console.error("通信エラー:", err);
  });

// ボタンを押した時の処理
button.addEventListener("click", function() {
  count = count + 2;
  text.textContent = "現在のカウント: " + count;

  // 増加後のカウントをサーバーへ送信してDBに保存
  fetch("http://localhost:3000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ newCount: count })
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    msgElement.textContent = data.message;
  })
  .catch(function(err) {
    console.error("保存エラー:", err);
  });
});