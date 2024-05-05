document.addEventListener("DOMContentLoaded", function () {
  // 假设这是从API获取的题目内容，这里直接硬编码
  const essayPromptText = `Directions: For this part, you are allowed 30 minutes to write an
  advertisement on your campus website to sell some of the course books you
  used at college. Your advertisement may include a brief description of
  their content, their condition and price and your contact information. You
  should write at least 120 words but no more than 180 words`; // 使用您提供的题目内容

  // 设置题目内容
  document.getElementById("essayPrompt").textContent = essayPromptText;

  // 给提交按钮添加点击事件监听器
  document.getElementById("submitBtn").addEventListener("click", function () {
    const essay = document.getElementById("essayInput").value;
    submitEssayForScoring(essay);
  });
});

async function submitEssayForScoring(essay) {
  try {
    // 修改这里的URL，确保它正确指向您的Node.js服务端点
    const response = await fetch("http://127.0.0.1:3000/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ essay }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    document.getElementById(
      "scoreDisplay"
    ).textContent = `你的分数是: ${data.totalScore}`;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    document.getElementById("scoreDisplay").textContent =
      "评分失败，请稍后再试。";
  }
}
