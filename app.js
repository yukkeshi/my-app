let count = 0;

const text = document.getElementById("count-text");
const button = document.getElementById("count-btn");

button.addEventListener("click", function() {
  count = count + 2;
  text.textContent = "現在のカウント: " + count;
});