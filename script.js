document.getElementById("submitBtn").addEventListener("click", function () {
  const essay = document.getElementById("essayInput").value;
  const grade = "cet4"; // 假设我们总是使用cet4等级
  const title = "你的作文标题"; // 可以是静态的，也可以是从HTML页面获取的

  const data = { q: essay, grade, to: title };
  // 这里需要将data对象转换为适合AJAX请求的格式，通常是URLSearchParams或JSON格式
  // 由于Node.js服务期望application/x-www-form-urlencoded格式，我们使用URLSearchParams

  fetch("/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("scoreDisplay").textContent =
        "你的分数是: " + data.totalScore;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
