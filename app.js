let count = 0;

const text = document.getElementById("count-text");
const button = document.getElementById("count-btn");
const resetBtn = document.getElementById("reset-btn");
const msgElement = document.getElementById("server-message");

// DBにカウントを保存する共通関数
function saveCount(newCount, successMsg) {
  fetch("http://localhost:3000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ newCount: newCount })
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    msgElement.textContent = successMsg || data.message;
  })
  .catch(function(err) {
    console.error("保存エラー:", err);
  });
}

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

// 増やすボタン
button.addEventListener("click", function() {
  count = count + 2;
  text.textContent = "現在のカウント: " + count;
  saveCount(count);
});

// リセットボタン
resetBtn.addEventListener("click", function() {
  count = 0;
  text.textContent = "現在のカウント: " + count;
  saveCount(count, "カウントをリセットしました！");
});